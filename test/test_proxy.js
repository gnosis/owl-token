
const { wait } = require('@digix/tempo')(web3)
const { assertRejects } = require('./utils.js')
const MathLib = artifacts.require('Math')
const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLUpdate = artifacts.require('TokenOWLUpdate')
const ProxyMaster = artifacts.require('ProxyMaster')

// Test VARS
let tokenOWL, tokenOWLNew
let pr
let airDrop


contract('TokenOWL - Proxy', (accounts) => {
  const [ master, notMaster, minter] = accounts

  before(async () => {
    const ProxyMasterContract = await ProxyMaster.deployed()
    tokenOWL = TokenOWL.at(ProxyMasterContract.address)
    // a new deployed TokenOWL to replace the old with
    tokenOWLNew = await TokenOWLUpdate.new()
  })

  const assertIsCreator = async (acc) => {
    const creator = await tokenOWL.creator.call()
    assert.strictEqual(creator, master, 'master account should be creator')
  }

  const assertIsNotCreator = async (acc) => {
    const creator = await tokenOWL.creator.call()
    assert.notStrictEqual(creator, acc, ' account should not be contract creator')
  }

  it('tokenOWL is initialized and params are set', async () => {
    const creator = await tokenOWL.creator.call()
    assert.equal(creator, master, 'Creator should be initialized')
  })

  it('masterCopy can\'t be updated before masterCopyCountdown was started', async () => {
    assertIsCreator(master)
    await assertRejects(tokenOWL.updateMasterCopy({ from: master }), 'should reject as startMasterCopyCountdown wasn\'t yet called')
   })

  it('not creator can\'t call startMasterCopyCountdown', async () => {
    assertIsNotCreator(notMaster)
    await assertRejects(tokenOWL.startMasterCopyCountdown(tokenOWLNew.address, { from: notMaster }), 'should reject as caller isn\'t the creator')
  })

  it('can\'t call startMasterCopyCountdown with zero address', async () => {
    assertIsCreator(master)
    await assertRejects(tokenOWL.startMasterCopyCountdown(0, { from: master }), 'should reject as caller isn\'t the creator')
  })

  it('creator can call startMasterCopyCountdown', async () => {
    assertIsCreator(master)
    await tokenOWL.startMasterCopyCountdown(tokenOWLNew.address, { from: master })
  })

  it('creator can\'t update masterCopy before time limit', async () => {
    assertIsCreator(master)
    await assertRejects(tokenOWL.updateMasterCopy({ from: master }), 'should reject as time hasn\t passed')
  })

  it('not creator can\'t update masterCopy', async () => {
    await wait(60 * 60 * 24 * 30)
    assertIsNotCreator(notMaster)
    await assertRejects(tokenOWL.updateMasterCopy({ from: notMaster }), 'should reject as caller isn\'t the creator')
  })

  it('creator can update masterCopy after time limit', async () => {
    assertIsCreator(master)
    await tokenOWL.setMinter(minter) 
    const ans = await tokenOWL.updateMasterCopy({ from: master })
    tokenOWL = TokenOWLUpdate.at(ProxyMaster.address)

    // testing that old variables are still available
    const param2 = await tokenOWL.minter.call()
    assert.equal(param2, minter, 'other variables should not be updated')

    // testing that we are actually talking to the new contract
    const param1 = await tokenOWL.getMasterCopy.call()
    assert.equal(param1, tokenOWLNew.address, 'pointing address should be updated')

    const tO = await TokenOWL.deployed()
    console.log(await tO.getMasterCopy.call())
    // testing that logic changed actually:
    // in TokenOWLUpdate setupTokenOWL should just run some events
    await tokenOWL.setupTokenOWL();
    assert.equal(0,1);
  })
})