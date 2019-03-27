/* global artifacts, web3 */
/* eslint no-undef: "error" */

const deployOwl = require('../src/migrations-truffle-5/3_deploy_OWL')
const canSetMinterCheck = require('../src/utils/can_set_minter')

module.exports = async function (deployer, network, accounts) {
  const canSetMinter = await canSetMinterCheck({ artifacts, accounts })

  if (canSetMinter) {
    console.log('Can setMinter on already available TokenOWL. No need to redeploy')
    return
  }

  // mainnet-fork is mainnet in --dry-run
  if (!canSetMinter && (network === 'mainnet' || network === 'mainnet-fork')) {
    console.log('Deploying account can\'t change TokenOWL minter')
    console.log('As network is mainnet, change TokenOWL minter separately afterwards')
    return
  }

  console.log('Deploying account can\'t change TokenOWL minter')
  console.log('Deploying a new TokenOWl and TokenOWLProxy for testing')

  return deployOwl({
    artifacts,
    deployer,
    network,
    accounts,
    web3
  })
}
