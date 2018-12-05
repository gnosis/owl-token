async function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const deployUtils = require('@gnosis.pm/util-contracts/src/migrations-truffle-5')
  const deployGno = require('@gnosis.pm/gno-token/src/migrations-truffle-5')

  const TokenGNO = artifacts.require('TokenGNO')

  function getGnoAddress () {
    try {
      return TokenGNO.address
    } catch (error) {
      // return TokenGNO.address throw an error if there's no config address
      // for this network
      return null
    }
  }
  const gnoAddress = getGnoAddress()

  if (network === 'development') {
    const deployParams = {
      artifacts,
      deployer,
      network,
      accounts,
      web3,
      initialTokenAmount: process.env.DEV_GNO_TOKEN_AMOUNT
    }

    await deployUtils(deployParams)
    if (!gnoAddress) {
      await deployGno(deployParams)
    } else {
      console.log(`No need to deploy GNO Token contract. Using: ${gnoAddress}`)
    }
  } else {
    console.log('Not in development, so nothing to do. Current network is %s', network)
  }
}

module.exports = migrate
