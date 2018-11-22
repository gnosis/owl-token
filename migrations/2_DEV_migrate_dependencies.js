/* global artifacts */
/* eslint no-undef: "error" */

const migrateDependencies = require('../src/migrations/2_DEV_migrate_dependencies')

module.exports = function (deployer, network, accounts) {
  return migrateDependencies({
    artifacts,
    deployer,
    network,
    accounts
  })
}
