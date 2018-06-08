/* global artifacts, web3 */
/* eslint no-undef: "error" */

const deployAirdrop = require('../src/migrations/4_deploy_OWL_airdrop')

module.exports = function (deployer, network, accounts) {
  return deployAirdrop({
    artifacts,
    deployer,
    network,
    accounts,
    web3,
    gnoLockPeriodInHours: process.env.GNO_LOCK_PERIOD_IN_HOURS
  })
}
