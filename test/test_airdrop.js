const { fromWei } = web3.utils
const { time, ether } = require('openzeppelin-test-helpers')
const { assertRejects } = require('./utils.js')
const MathLib = artifacts.require('Math')
const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const FakeToken = artifacts.require('FakeToken')
const OWLAirdrop = artifacts.require('OWLAirdrop')

OWLAirdrop.link(MathLib)

contract('OWLAirdrop', accounts => {
  const [creator, holder] = accounts
  const duration = 100
  let fakeGNO, tokenOWL, owlAirdrop, startTime, endTime

  before(async () => {
    fakeGNO = await FakeToken.new()
    const ProxyMasterContract = await TokenOWLProxy.deployed()
    tokenOWL = await TokenOWL.at(ProxyMasterContract.address)
    startTime = (await web3.eth.getBlock('pending')).timestamp
    endTime = startTime + duration
    await fakeGNO.transfer(holder, ether('2'), { from: creator })
  })

  it('cannot make airdrop with past endTime', async () => {
    await assertRejects(OWLAirdrop.new(tokenOWL.address, fakeGNO.address, startTime - 1, { from: creator }))
  })

  it('can make airdrop with good endTime', async () => {
    owlAirdrop = await OWLAirdrop.new(tokenOWL.address, fakeGNO.address, endTime, { from: creator })
    assert.notEqual(owlAirdrop, 0)
  })

  it('cannot lock GNO until airdrop is authorized', async () => {
    await fakeGNO.approve(owlAirdrop.address, ether('0.5'), { from: holder })
    assert.equal(await fakeGNO.allowance.call(holder, owlAirdrop.address), 5e17)
    await assertRejects(owlAirdrop.lockGNO(ether('0.5'), { from: holder }))
  })

  it('can lock GNO and mint 10x OWL tokens once authorized to mint', async () => {
    await tokenOWL.setMinter(owlAirdrop.address, { from: creator })
    assert.equal((await fakeGNO.allowance.call(holder, owlAirdrop.address)), 5e17)
    const initialGNOBalance = await fakeGNO.balanceOf.call(holder)
    await owlAirdrop.lockGNO(ether('0.5'), { from: holder })
    assert.equal(fromWei(await fakeGNO.balanceOf.call(holder)), fromWei(initialGNOBalance.sub(ether('0.5'))))
    assert.equal((await owlAirdrop.lockedGNO.call(holder)), 5e17)
    assert.equal((await tokenOWL.balanceOf.call(holder)), 5e18)
  })

  it('can continue locking GNO to mint more OWL', async () => {
    await fakeGNO.approve(owlAirdrop.address, ether('2'), { from: holder })
    const initialGNOBalance = await fakeGNO.balanceOf.call(holder)
    await owlAirdrop.lockGNO(ether('1.5'), { from: holder })
    assert.equal(fromWei(await fakeGNO.balanceOf.call(holder)), fromWei(initialGNOBalance.sub(ether('1.5'))))
    assert.equal((await owlAirdrop.lockedGNO.call(holder)), 2e18)
    assert.equal((await tokenOWL.balanceOf.call(holder)), 2e19)
  })

  it('can not withdraw GNO while airdrop has not ended', async () => {
    await assertRejects(owlAirdrop.withdrawGNO({ from: holder }))
  })

  it('can withdraw all GNO once airdrop has ended', async () => {
    await time.increase(duration + 1)
    assert.equal(await fakeGNO.balanceOf.call(holder), 0)
    await owlAirdrop.withdrawGNO({ from: holder })
    assert.equal(await fakeGNO.balanceOf.call(holder), 2e18)
  })

  it('can not lock GNO to mint more OWL once airdrop has ended', async () => {
    await fakeGNO.approve(owlAirdrop.address, ether('0.5'), { from: holder })
    assert.equal(await fakeGNO.allowance.call(holder, owlAirdrop.address), 5e17)
    await assertRejects(owlAirdrop.lockGNO(ether('0.5'), { from: holder }))
  })
})
