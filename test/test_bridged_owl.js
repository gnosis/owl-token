/* global artifacts, contract, assert */

const { assertRejects } = require('./utils')

const BridgedTokenOWL = artifacts.require('BridgedTokenOWL')

contract('BridgedTokenOWL', ([user1, user2, burnReceiver]) => {
  describe('burnOWL', () => {
    it('credits burned amount to burnReceiver', async () => {
      const token = await BridgedTokenOWL.new('xOWL', 'OWL', 18, 100, burnReceiver)
      await token.mint(user1, 100)
      await token.approve(user1, 100)

      await token.burnOWL(user1, 100)
      assert.equal(await token.balanceOf(user1), 0)
      assert.equal(await token.balanceOf(burnReceiver), 100)
    })

    it('cannot burn own OWL without approval', async () => {
      const token = await BridgedTokenOWL.new('xOWL', 'OWL', 18, 100, burnReceiver)
      await token.mint(user1, 100)

      await assertRejects(token.burnOWL(user1, 100, { from: user1 }))
    })

    it('cannot burn more than approved', async () => {
      const token = await BridgedTokenOWL.new('xOWL', 'OWL', 18, 100, burnReceiver)
      await token.mint(user1, 100)
      await token.approve(user1, 50)

      await assertRejects(token.burnOWL(user1, 100, { from: user1 }))
    })

    it('cannot burn more than current balance', async () => {
      const token = await BridgedTokenOWL.new('xOWL', 'OWL', 18, 100, burnReceiver)
      await token.mint(user1, 100)
      await token.approve(user1, 200)

      await assertRejects(token.burnOWL(user1, 200, { from: user1 }))
    })
  })
  describe('setBurnReceiver', () => {
    it('allows only current burnReceive to set new one', async () => {
      const token = await BridgedTokenOWL.new('xOWL', 'OWL', 18, 100, burnReceiver)
      await assertRejects(token.setBurnReceiver(user2, { from: user1 }))
      await token.setBurnReceiver(user2, { from: burnReceiver })
    })
    it('credits burned OWL to new receiver after change', async () => {
      const token = await BridgedTokenOWL.new('xOWL', 'OWL', 18, 100, burnReceiver)
      await token.setBurnReceiver(user2, { from: burnReceiver })

      await token.mint(user1, 100)
      await token.approve(user1, 100)

      await token.burnOWL(user1, 100)
      assert.equal(await token.balanceOf(user2), 100)
    })
  })
})
