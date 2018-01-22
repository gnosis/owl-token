const { assertRejects } = require('./utils.js')
const TokenOWL = artifacts.require('TokenOWL')

contract('TokenOWL', (accounts) => {
  const [master, OWLHolder, , NoOWLHolder] = accounts
  let tokenOWL

  before(async () => {
    tokenOWL = await TokenOWL.deployed()
    await tokenOWL.transfer(OWLHolder, 10 ** 18, { from: master })
  })

  it('check that NoOWLHolder can not call the burn function', async () => {
    await assertRejects(tokenOWL.burnOWL(1, { from: NoOWLHolder }), 'Non-OWL holder able to burn OWL')
  })

  it('check that OWLHolder can call the burn OWL and that this costs him the OWL', async () => {
    const balanceBefore = (await tokenOWL.balanceOf.call(OWLHolder)).toNumber()
    await tokenOWL.burnOWL(10 ** 18, { from: OWLHolder })
    assert.equal(balanceBefore - 10 ** 18, (await tokenOWL.balanceOf.call(OWLHolder)).toNumber())
  })
})
