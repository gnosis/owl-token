const { assertRejects } = require('./utils.js')
const TokenOWL = artifacts.require('TokenOWL')

contract('TokenOWL', (accounts) => {
  const [creator, minter, holder, notHolder] = accounts
  let tokenOWL

  before(async () => {
    tokenOWL = await TokenOWL.deployed()
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

  it('check that NoOWLHolder can not call the burn function', async () => {
    await assertRejects(tokenOWL.burnOWL(1, { from: notHolder }), 'Non-OWL holder able to burn OWL')
  })

  it('check that OWLHolder can call the burn OWL and that this costs him the OWL', async () => {
    const balanceBefore = (await tokenOWL.balanceOf.call(holder)).toNumber()
    await tokenOWL.burnOWL(10 ** 18, { from: holder })
    assert.equal(balanceBefore - 10 ** 18, (await tokenOWL.balanceOf.call(holder)).toNumber())
  })
})
