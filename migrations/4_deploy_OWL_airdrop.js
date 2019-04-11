/* global artifacts, web3 */
/* eslint no-undef: "error" */

const deployAirdrop = require('../src/migrations-truffle-5/4_deploy_OWL_airdrop')

module.exports = function (deployer, network, accounts) {
  if (process.env.DEPLOY_OWL_ONLY) {
    console.log('Only deploying TokenOWL in this run')
    return
  }

  let gnoLockEndTime
  // i.e. LOCK_END_TIME='2019-06-12T16:00:00+02:00'
  if (process.env.LOCK_END_TIME) {
    gnoLockEndTime = new Date(Date.parse(process.env.LOCK_END_TIME))
  } else {
    throw new Error(`
  LOCK_END_TIME environment variable is not specified
  It must be in ISO date format, e.g:
  LOCK_END_TIME='2019-06-12T16:00:00+02:00' npm run migrate
  `)
  }

  if (!process.env.OWL_PER_GNO) throw new Error('OWL_PER_GNO environment variable is not specified')

  return deployAirdrop({
    artifacts,
    deployer,
    network,
    accounts,
    web3,
    gnoLockEndTime,
    multiplier: process.env.OWL_PER_GNO
  })
}
