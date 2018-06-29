/* global artifacts, web3 */
/* eslint no-undef: "error" */

const assert = require('assert')
//const _web3 = require('web3')

const GAS = 5e5 // 500K
const DEFAULT_GAS_PRICE_GWEI = 5

// Usage example:
//  yarn change-owner -h
//  MNEMONIC="your secret ..." yarn change-owner --owner 0x123456 --network=rinkeby --dry-run
//  MNEMONIC="your secret ..." yarn change-owner --owner 0x123456 --network=rinkeby

var argv = require('yargs')
  .usage('Usage: yarn change-owner [--owner newAddress] [--gas num] [--gas-price num] [--network name] [--dry-run]')
  .demandOption('owner')
  .option('owner', {
    type: 'string',
    describe: 'New owner address.'
  })
  .option('gasPrice', {
    type: 'integer',
    default: process.env.GAS_PRICE_GWEI || DEFAULT_GAS_PRICE_GWEI,
    describe: 'Gas price used for the transaction in GWei'
  })
  .option('network', {
    type: 'string',
    default: 'development',
    describe: 'One of the ethereum networks defined in truffle config'
  })
  .option('dryRun', {
    type: 'boolean',
    default: false,
    describe: 'Dry run. Do not add the token pair, do just the validations.'
  })  
  .help('h')
  .strict()
  .argv

async function changeOwner () {
  if (!argv._[0]) {
    argv.showHelp()
  } else {
    const { owner: newOwner, gasPrice, network, dryRun } = argv

    console.log('\n **************  Change owner  **************\n')
    console.log(`Data:
    Dry run: ${dryRun ? 'Yes' : 'No'}
    Network: ${network}
    Gas: ${GAS}
    Gas Price: ${gasPrice} GWei`)

    // Load the DX contract
    const { owl, creator, account } = await loadContractData()
    console.log(`\
    OWL address: ${owl.address}
    Creator: ${creator}
    Current account: ${account}
`)

    console.log(`Change owner, from ${creator} to ${newOwner}`)

    // Validations
    assert(web3.isAddress(newOwner), `The address ${newOwner} is not valid`)
    assert.equal(account, creator, 'The account used to run the script must be the current owner of OWL')

    if (newOwner !== creator) {
      if (dryRun) {
        // Dry run
        console.log('The dry run execution passed all validations')
        await owl.setNewOwner.call(newOwner, {
          from: account
        })
        console.log('Dry run success!')
      } else {
        // Change owner
        const changeOwnerResult = await owl.setNewOwner(newOwner, {
          from: account,
          gas: GAS,
          gasPrice: gasPrice * 1e9
        })
        console.log('Success! The owner was changed. Transaction: ' + changeOwnerResult.tx)
      }
    } else {
      console.log(`The owner is already ${newOwner}, there's no need to update it`)
    }
    console.log('\n **************  End change owner **************\n')
  }
}

async function loadContractData () {
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const TokenOWL = artifacts.require('TokenOWL')

  // Get contract examples
  const proxy = await TokenOWLProxy.deployed()
  const owl = TokenOWL.at(proxy.address)

  // Get some data from dx
  const [
    creator,
    accounts
  ] = await Promise.all([
    // Get weth address
    owl.creator.call(),

    // get Accounts
    new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  ])

  return {
    owl,
    creator,
    account: accounts[0]
  }
}

module.exports = callback => {
  changeOwner()
    .then(callback)
    .catch(callback)
}
