/* global artifacts, web3 */
/* eslint no-undef: "error" */

const migrateDependencies = require('../src/migrations-truffle-4/2_DEV_migrate_dependencies')

module.exports = function (deployer, network, accounts) {
  return migrateDependencies({
    artifacts,
    deployer,
    network,
    accounts,
    web3
  })
}
