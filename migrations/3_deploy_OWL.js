/* global artifacts */
/* eslint no-undef: "error" */

const deployOwl = require('../src/migrations/3_deploy_OWL')

module.exports = function (deployer, network, accounts) {
  return deployOwl({
    artifacts,
    deployer,
    network,
    accounts,
    gnoLockPeriodInHours: process.env.GNO_LOCK_PERIOD_IN_HOURS
  })
}
