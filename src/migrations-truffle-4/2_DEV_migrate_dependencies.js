function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const deployMath = require('@gnosis.pm/util-contracts/src/migrations-truffle-4')
  const deployGno = require('@gnosis.pm/gno-token/src/migrations-truffle-4')

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

module.exports = migrate
