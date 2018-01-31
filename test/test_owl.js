const { assertRejects } = require('./utils.js')
const TokenOWL = artifacts.require('TokenOWL')
const ProxyMaster = artifacts.require('ProxyMaster')


contract('TokenOWL', (accounts) => {
  const [creator, minter, altMinter, holder, notHolder] = accounts
  let tokenOWL

  before(async () => {
    const ProxyMasterContract = await ProxyMaster.deployed()
    tokenOWL = TokenOWL.at(ProxyMasterContract.address)
  })

  it('allows only the creator to set the minter', async () => {
    assert.equal(await tokenOWL.creator.call(), creator)
    assert.equal(await tokenOWL.minter.call(), 0)

    await tokenOWL.setMinter(minter, { from: creator })
    assert.equal(await tokenOWL.minter.call(), minter)

    for(let other of [minter, holder, notHolder]) {
      await assertRejects(tokenOWL.setMinter(minter, { from: other }))
    }
  })

  contract('minting', () => {
    before(async () => {
      await tokenOWL.setMinter(minter, { from: creator })
    })

    it('allows only the minter to mint', async () => {
      assert.equal((await tokenOWL.balanceOf.call(holder)).valueOf(), 0)
      await tokenOWL.mintOWL(holder, 1e18, { from: minter })
      assert.equal((await tokenOWL.balanceOf.call(holder)).valueOf(), 1e18)

      for(let other of [creator, altMinter, holder, notHolder]) {
        await assertRejects(tokenOWL.mintOWL(holder, 1e18, { from: other }))
      }
    })

    it('revokes minting privileges for old minter upon setting new minter', async () => {
      assert.equal(await tokenOWL.minter.call(), minter)
      await tokenOWL.setMinter(altMinter, { from: creator })
      assert.equal(await tokenOWL.minter.call(), altMinter)

      assert.equal((await tokenOWL.balanceOf.call(holder)).valueOf(), 1e18)
      await tokenOWL.mintOWL(holder, 1e18, { from: altMinter })
      assert.equal((await tokenOWL.balanceOf.call(holder)).valueOf(), 2e18)

      await assertRejects(tokenOWL.mintOWL(holder, 1e18, { from: minter }))
    })
  })

  contract('burning', () => {
    before(async () => {
      await tokenOWL.setMinter(minter, { from: creator })
      await tokenOWL.mintOWL(holder, 1e18, { from: minter })
    })

    it('check that NoOWLHolder can not call the burn function', async () => {
      await assertRejects(tokenOWL.burnOWL(1, { from: notHolder }), 'Non-OWL holder able to burn OWL')
    })

    it('check that OWLHolder can call the burn OWL and that this costs him the OWL', async () => {
      const balanceBefore = (await tokenOWL.balanceOf.call(holder)).toNumber()
      await tokenOWL.burnOWL(10 ** 18, { from: holder })
      assert.equal(balanceBefore - 10 ** 18, (await tokenOWL.balanceOf.call(holder)).toNumber())
    })
  })
})
