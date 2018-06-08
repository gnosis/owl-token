/* global artifacts */
/* eslint no-undef: "error" */

const setMinter = require('../src/migrations/5_set_airdrop_as_OWL_minter')

module.exports = function (deployer, network, accounts) {
  return setMinter({
    artifacts,
    deployer,
    network,
    accounts
  })
}
