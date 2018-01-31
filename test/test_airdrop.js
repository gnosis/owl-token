const { wait } = require('@digix/tempo')(web3)
const { assertRejects } = require('./utils.js')
const MathLib = artifacts.require('Math')
const TokenOWL = artifacts.require('TokenOWL')
const FakeToken = artifacts.require('FakeToken')
const OWLAirdrop = artifacts.require('OWLAirdrop')
const ProxyMaster = artifacts.require('ProxyMaster')

OWLAirdrop.link(MathLib)

contract('OWLAirdrop', (accounts) => {
  const [creator, holder] = accounts
  const duration = 100
  let fakeGNO, tokenOWL, owlAirdrop, startTime, endTime

  before(async () => {
    fakeGNO = await FakeToken.deployed()
    const ProxyMasterContract = await ProxyMaster.deployed()
    tokenOWL = TokenOWL.at(ProxyMasterContract.address)
    startTime = (await web3.eth.getBlock('pending')).timestamp
    endTime = startTime + duration
    await fakeGNO.transfer(holder, 2e18, { from: creator })
  })

  it('cannot make airdrop with past endTime', async () => {
    await assertRejects(OWLAirdrop.new(tokenOWL.address, fakeGNO.address, startTime - 1, { from: creator }))
  })

  it('can make airdrop with good endTime', async () => {
    owlAirdrop = await OWLAirdrop.new(tokenOWL.address, fakeGNO.address, endTime, { from: creator })
    assert.notEqual(owlAirdrop, 0)
  })

  it('cannot lock GNO until airdrop is authorized', async () => {
    await fakeGNO.approve(owlAirdrop.address, 5e17, { from: holder })
    assert.equal(await fakeGNO.allowance.call(holder, owlAirdrop.address), 5e17)
    await assertRejects(owlAirdrop.lockGNO(5e17, { from: holder }))
  })

  it('can lock GNO and mint 10x OWL tokens once authorized to mint', async () => {
    await tokenOWL.setMinter(owlAirdrop.address, { from: creator })
    assert.equal((await fakeGNO.allowance.call(holder, owlAirdrop.address)).valueOf(), 5e17)
    const initialGNOBalance = await fakeGNO.balanceOf.call(holder)
    await owlAirdrop.lockGNO(5e17, { from: holder })
    assert.equal((await fakeGNO.balanceOf.call(holder)).valueOf(), initialGNOBalance.sub(5e17).valueOf())
    assert.equal((await owlAirdrop.lockedGNO.call(holder)).valueOf(), 5e17)
    assert.equal((await tokenOWL.balanceOf.call(holder)).valueOf(), 5e18)
  })

  it('can continue locking GNO to mint more OWL', async () => {
    await fakeGNO.approve(owlAirdrop.address, 2e18, { from: holder })
    const initialGNOBalance = await fakeGNO.balanceOf.call(holder)
    await owlAirdrop.lockGNO(1.5e18, { from: holder })
    assert.equal((await fakeGNO.balanceOf.call(holder)).valueOf(), initialGNOBalance.sub(1.5e18).valueOf())
    assert.equal((await owlAirdrop.lockedGNO.call(holder)).valueOf(), 2e18)
    assert.equal((await tokenOWL.balanceOf.call(holder)).valueOf(), 2e19)
  })

  it('can not withdraw GNO while airdrop has not ended', async () => {
    await assertRejects(owlAirdrop.withdrawGNO({ from: holder }))
  })

  it('can withdraw all GNO once airdrop has ended', async () => {
    await wait(duration + 1)
    assert.equal(await fakeGNO.balanceOf.call(holder), 0)
    await owlAirdrop.withdrawGNO({ from: holder })
    assert.equal(await fakeGNO.balanceOf.call(holder), 2e18)
  })

  it('can not lock GNO to mint more OWL once airdrop has ended', async () => {
    await fakeGNO.approve(owlAirdrop.address, 5e17, { from: holder })
    assert.equal(await fakeGNO.allowance.call(holder, owlAirdrop.address), 5e17)
    await assertRejects(owlAirdrop.lockGNO(5e17, { from: holder }))
  })
})