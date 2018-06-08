/* global artifacts, web3 */
/* eslint no-undef: "error" */

const deployMath = require('@gnosis.pm/util-contracts/src/migrations/2_deploy_math')
const deployGno = require('@gnosis.pm/gno-token/src/migrations/3_deploy_GNO')

module.exports = function (deployer, network, accounts) {
  if (network === 'development') {
    const deployParams = {
      artifacts,
      deployer,
      network,
      accounts,
      web3,
      initialTokenAmount: process.env.DEV_GNO_TOKEN_AMOUNT
    }
    deployer
      .then(() => deployMath(deployParams))
      .then(() => deployGno(deployParams))
  } else {
    console.log('Not in development, so nothing to do. Current network is %s', network)
  }
}
