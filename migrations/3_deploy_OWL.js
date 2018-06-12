/* global artifacts */
/* eslint no-undef: "error" */

const deployOwl = require('../src/migrations/3_deploy_OWL')

module.exports = function (deployer, network, accounts) {
  return deployOwl({
    artifacts,
    deployer,
    network,
    accounts
  })
}
