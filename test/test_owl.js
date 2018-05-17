const { assertRejects } = require('./utils.js')
const TokenOWL = artifacts.require('TokenOWL')
const ProxyMaster = artifacts.require('ProxyMaster')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')



contract('TokenOWL', (accounts) => {
  const [creator, minter, altMinter, OWLHolder, notOWLHolder, notApprover, contractConsumingOWL, newOwner] = accounts
  let tokenOWL

  before(async () => {
    const ProxyMasterContract = await TokenOWLProxy.deployed()
    tokenOWL = TokenOWL.at(ProxyMasterContract.address)
  })

  it('allows only the creator to set the minter', async () => {
    assert.equal(await tokenOWL.creator.call(), creator)
    assert.equal(await tokenOWL.minter.call(), 0)

    await tokenOWL.setMinter(minter, { from: creator })
    assert.equal(await tokenOWL.minter.call(), minter)

    for(let other of [minter, OWLHolder, notOWLHolder]) {
      await assertRejects(tokenOWL.setMinter(minter, { from: other }))
    }
  })

it('allows only the creator/owner to change the owner', async () => {
    assert.equal(await tokenOWL.creator.call(), creator)

    await tokenOWL.setNewOwner(newOwner, { from: creator })
    assert.equal(await tokenOWL.creator.call(), newOwner)

    for(let other of [minter, OWLHolder, notOWLHolder]) {
      await assertRejects(tokenOWL.setMinter(minter, { from: other }))
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
      await tokenOWL.mintOWL(OWLHolder, 1e18, { from: minter })
      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 1e18)

      for(let other of [creator, altMinter, OWLHolder, notOWLHolder]) {
        await assertRejects(tokenOWL.mintOWL(OWLHolder, 1e18, { from: other }))
      }
    })

    it('revokes minting privileges for old minter upon setting new minter', async () => {
      assert.equal(await tokenOWL.minter.call(), minter)
      await tokenOWL.setMinter(altMinter, { from: creator })
      assert.equal(await tokenOWL.minter.call(), altMinter)

      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 1e18)
      await tokenOWL.mintOWL(OWLHolder, 1e18, { from: altMinter })
      assert.equal((await tokenOWL.balanceOf.call(OWLHolder)).valueOf(), 2e18)

      await assertRejects(tokenOWL.mintOWL(OWLHolder, 1e18, { from: minter }))
    })
  })

  contract('burning', () => {
    before(async () => {
      await tokenOWL.setMinter(minter, { from: creator })
      await tokenOWL.mintOWL(OWLHolder, 1e18, { from: minter })
    })

    it('check that burning is not working, if allowance is not enough', async () => {
      await tokenOWL.approve(contractConsumingOWL, 1e5,{ from: OWLHolder })
      assert.equal((await tokenOWL.allowance(OWLHolder,contractConsumingOWL)).toNumber(),1e5)
      assert.isAtLeast((await tokenOWL.balanceOf(OWLHolder)).toNumber(),1e10, 'OWLHolder has not enough funds')
      await assertRejects(tokenOWL.burnOWL(OWLHolder, 1e10, { from: contractConsumingOWL }), ' able to burn OWL although allowance is not enough')
    })

    it('check that NotOWLHolder can not get OWL burnt', async () => {
      await tokenOWL.approve(contractConsumingOWL, 1e18,{ from: notOWLHolder })

      assert.equal(1e18,(await tokenOWL.allowance(notOWLHolder, contractConsumingOWL)).toNumber())
      assert.isAtLeast((await tokenOWL.balanceOf(notOWLHolder)).toNumber(),0)

      await assertRejects(tokenOWL.burnOWL(notOWLHolder,1, { from: contractConsumingOWL }), 'able to burn OWL although there are not enough OWL to burn')
    })
    
    it('allows contract to burn OWL on behalf of OWLHolder if OWLHolder has set an allowance for contract', async () => {
      const balanceBefore = (await tokenOWL.balanceOf.call(OWLHolder)).toNumber()

      await tokenOWL.approve(contractConsumingOWL, 1e18,{ from: OWLHolder })
      const allowanceBefore = (await tokenOWL.allowance.call(OWLHolder, contractConsumingOWL)).toNumber()

      await tokenOWL.burnOWL(OWLHolder, 10 ** 18, { from: contractConsumingOWL})

      assert.equal(balanceBefore - 10 ** 18, (await tokenOWL.balanceOf.call(OWLHolder)).toNumber(), 'balance not updated correctly')
      assert.equal(allowanceBefore - 10 ** 18, (await tokenOWL.allowance.call(OWLHolder, contractConsumingOWL)).toNumber(), 'allowance was not changed correctly')
    })
  })
})
