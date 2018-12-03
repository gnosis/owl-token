/* global artifacts */
/* eslint no-undef: "error" */

const migrateDependencies = require('../src/migrations-truffle-5/2_DEV_migrate_dependencies')

module.exports = function (deployer, network, accounts) {
  return migrateDependencies({
    artifacts,
    deployer,
    network,
    accounts
  })
}
