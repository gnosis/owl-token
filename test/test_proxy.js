/* global artifacts, contract, assert */

const { time } = require('openzeppelin-test-helpers')
const { assertRejects } = require('./utils.js')
const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLUpdateFixture = artifacts.require('TokenOWLUpdateFixture')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')

// Test VARS
let tokenOWL, tokenOWLNew

contract('TokenOWL - Proxy', accounts => {
  const [ master, notMaster, minter ] = accounts

  before(async () => {
    const ProxyMasterContract = await TokenOWLProxy.deployed()
    tokenOWL = await TokenOWL.at(ProxyMasterContract.address)
    // a new deployed TokenOWL to replace the old with
    tokenOWLNew = await TokenOWLUpdateFixture.new()
  })

  const assertIsCreator = async acc => {
    const creator = await tokenOWL.creator.call()
    assert.strictEqual(creator, master, 'master account should be creator')
  }

  const assertIsNotCreator = async acc => {
    const creator = await tokenOWL.creator.call()
    assert.notStrictEqual(creator, acc, ' account should not be contract creator')
  }

  it('tokenOWL is initialized and params are set', async () => {
    const creator = await tokenOWL.creator.call()
    assert.equal(creator, master, 'Creator should be initialized')
  })

  it('masterCopy can\'t be updated before masterCopyCountdown was started', async () => {
    await assertIsCreator(master)
    await assertRejects(tokenOWL.updateMasterCopy({ from: master }), 'should reject as startMasterCopyCountdown wasn\'t yet called')
  })

  it('not creator can\'t call startMasterCopyCountdown', async () => {
    await assertIsNotCreator(notMaster)
    await assertRejects(tokenOWL.startMasterCopyCountdown(tokenOWLNew.address, { from: notMaster }), 'should reject as caller isn\'t the creator')
  })

  it('can\'t call startMasterCopyCountdown with zero address', async () => {
    await assertIsCreator(master)
    await assertRejects(tokenOWL.startMasterCopyCountdown(0, { from: master }), 'should reject as caller isn\'t the creator')
  })

  it('creator can call startMasterCopyCountdown', async () => {
    await assertIsCreator(master)
    await tokenOWL.startMasterCopyCountdown(tokenOWLNew.address, { from: master })
  })

  it('creator can\'t update masterCopy before time limit', async () => {
    await assertIsCreator(master)
    await assertRejects(tokenOWL.updateMasterCopy({ from: master }), 'should reject as time hasn\t passed')
  })

  it('not creator can\'t update masterCopy', async () => {
    await time.increase(60 * 60 * 24 * 30)
    await assertIsNotCreator(notMaster)
    await assertRejects(tokenOWL.updateMasterCopy({ from: notMaster }), 'should reject as caller isn\'t the creator')
  })

  it('creator can update masterCopy after time limit', async () => {
    await assertIsCreator(master)
    await tokenOWL.setMinter(minter)
    await tokenOWL.updateMasterCopy({ from: master })
    tokenOWL = await TokenOWLUpdateFixture.at(TokenOWLProxy.address)

    // testing that old variables are still available
    const param2 = await tokenOWL.minter.call()
    assert.equal(param2, minter, 'other variables should not be updated')

    // testing that we are actually talking to the new contract
    const param1 = await tokenOWL.getMasterCopy.call()
    assert.equal(param1, tokenOWLNew.address, 'pointing address should be updated')

    // testing that logic changed actually:
    // in TokenOWL, setupTokenOWL is not existent
    // in TokenOWLUpdateFixture setupTokenOWL should just set the minter ==0
    await tokenOWL.setupTokenOWL()
    const newMinter = await tokenOWL.minter.call()
    // console.log("new minter"+newMinter)
    assert.equal(newMinter, 0)
  })
})
