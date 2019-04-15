/* global artifacts, web3 */
/* eslint no-undef: "error" */

const setMinter = require('../src/migrations-truffle-5/5_set_airdrop_as_OWL_minter')
const canSetMinterCheck = require('../src/utils/can_set_minter')

module.exports = async function (deployer, network, accounts) {
  if (process.env.DEPLOY_OWL_ONLY) {
    console.log('Only deploying TokenOWL in this run')
    return
  }

  const canSetMinter = await canSetMinterCheck({ artifacts, accounts })

  // mainnet-fork is mainnet in --dry-run
  if (!canSetMinter && (
    network === 'mainnet' || network === 'mainnet-fork' ||
    network === 'rinkeby' || network === 'rinkeby-fork'
  )) {
    console.log('Deploying account can\'t change TokenOWL minter')
    console.log(`As network is ${network}, change TokenOWL minter separately afterwards`)
    return
  }

  return setMinter({
    artifacts,
    deployer,
    network,
    accounts,
    web3
  })
}
