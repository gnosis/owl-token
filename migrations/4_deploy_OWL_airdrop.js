/* global artifacts, web3 */
/* eslint no-undef: "error" */

const deployAirdrop = require('../src/migrations/4_deploy_OWL_airdrop')

let gnoLockEndTime
// i.e. LOCK_END_TIME='2018-06-12T16:00:00+02:00'
if (process.env.LOCK_END_TIME) {
  gnoLockEndTime = new Date(Date.parse(process.env.LOCK_END_TIME))
}

module.exports = function (deployer, network, accounts) {
  return deployAirdrop({
    artifacts,
    deployer,
    network,
    accounts,
    web3,
    gnoLockEndTime
  })
}
