/* global artifacts, web3, contract, assert */

const { assertRejects } = require('./utils.js')
const { toWei } = web3.utils
const { BN, ether } = require('openzeppelin-test-helpers')
const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const OWLAirdrop = artifacts.require('OWLAirdrop')

contract('TokenOWL', accounts => {
  const [creator, minter, altMinter, OWLHolder, notOWLHolder,, contractConsumingOWL] = accounts

  let tokenOWL
  let owlAirdrop

  before(async () => {
    const ProxyMasterContract = await TokenOWLProxy.deployed()
    tokenOWL = await TokenOWL.at(ProxyMasterContract.address)
    owlAirdrop = await OWLAirdrop.deployed()
  })

  it('allows only the creator to set the minter', async () => {
    assert.equal(await tokenOWL.creator.call(), creator)
    assert.equal(await tokenOWL.minter.call(), owlAirdrop.address)

    await tokenOWL.setMinter(minter, { from: creator })
    assert.equal(await tokenOWL.minter.call(), minter)

    for (let other of [minter, OWLHolder, notOWLHolder]) {
      await assertRejects(tokenOWL.setMinter(minter, { from: other }))
    }
  })

  it('allows only the creator/owner to change the owner', async () => {
    const newOwner = altMinter
    assert.equal(await tokenOWL.creator.call(), creator)

    await tokenOWL.setNewOwner(newOwner, { from: creator })
    assert.equal(await tokenOWL.creator.call(), newOwner)

    for (let other of [minter, OWLHolder, notOWLHolder]) {
      await assertRejects(tokenOWL.setNewOwner(minter, { from: other }))
    }

    await tokenOWL.setNewOwner(creator, { from: newOwner })
    assert.equal(await tokenOWL.creator.call(), creator)
  })

  contract('minting', () => {
    before(async () => {
      await tokenOWL.setMinter(minter, { from: creator })
    })

    it('allows only the minter to mint', async () => {
      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 0)
      await tokenOWL.mintOWL(OWLHolder, ether('1'), { from: minter })
      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 1e18)

      for (let other of [creator, altMinter, OWLHolder, notOWLHolder]) {
        await assertRejects(tokenOWL.mintOWL(OWLHolder, ether('1'), { from: other }))
      }
    })

    it('revokes minting privileges for old minter upon setting new minter', async () => {
      assert.equal(await tokenOWL.minter.call(), minter)
      await tokenOWL.setMinter(altMinter, { from: creator })
      assert.equal(await tokenOWL.minter.call(), altMinter)

      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 1e18)
      await tokenOWL.mintOWL(OWLHolder, ether('1'), { from: altMinter })
      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 2e18)

      await assertRejects(tokenOWL.mintOWL(OWLHolder, 1e18, { from: minter }))
    })
  })

  contract('burning', () => {
    before(async () => {
      await tokenOWL.setMinter(minter, { from: creator })
      await tokenOWL.mintOWL(OWLHolder, ether('1'), { from: minter })
    })

    it('check that burning is not working, if allowance is not enough', async () => {
      await tokenOWL.approve(contractConsumingOWL, new BN(toWei('100000', 'wei')), { from: OWLHolder })
      assert.equal((await tokenOWL.allowance(OWLHolder, contractConsumingOWL)).toNumber(), 1e5)
      assert.isAtLeast(parseInt(await tokenOWL.balanceOf(OWLHolder)), 1e10, 'OWLHolder has not enough funds')
      await assertRejects(tokenOWL.burnOWL(OWLHolder, 1e10, { from: contractConsumingOWL }), ' able to burn OWL although allowance is not enough')
    })

    it('check that NotOWLHolder can not get OWL burnt', async () => {
      await tokenOWL.approve(contractConsumingOWL, ether('1'), { from: notOWLHolder })

      assert.equal(1e18, (await tokenOWL.allowance(notOWLHolder, contractConsumingOWL)))
      assert.isAtLeast(parseInt(await tokenOWL.balanceOf(notOWLHolder)), 0)

      await assertRejects(tokenOWL.burnOWL(notOWLHolder, 1, { from: contractConsumingOWL }), 'able to burn OWL although there are not enough OWL to burn')
    })

    it('allows contract to burn OWL on behalf of OWLHolder if OWLHolder has set an allowance for contract', async () => {
      const balanceBefore = (await tokenOWL.balanceOf.call(OWLHolder))

      await tokenOWL.approve(contractConsumingOWL, ether('1'), { from: OWLHolder })
      const allowanceBefore = (await tokenOWL.allowance.call(OWLHolder, contractConsumingOWL))

      await tokenOWL.burnOWL(OWLHolder, ether('1'), { from: contractConsumingOWL })

      assert.equal(balanceBefore - 10 ** 18, (await tokenOWL.balanceOf.call(OWLHolder)), 'balance not updated correctly')
      assert.equal(allowanceBefore - 10 ** 18, (await tokenOWL.allowance.call(OWLHolder, contractConsumingOWL)), 'allowance was not changed correctly')
    })
  })
})
