function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const { Math } = _getDependencies(artifacts, network, deployer)

  return deployer
    .then(() => Math.deployed())
    .then(() => deployer.link(Math, [ TokenOWL, TokenOWLProxy ]))
    .then(() => deployer.deploy(TokenOWL))
    .then(() => deployer.deploy(TokenOWLProxy, TokenOWL.address))
}

function _getDependencies (artifacts, network, deployer) {
  let Math
  if (network === 'development') {
    Math = artifacts.require('Math')
  } else {
    const contract = require('truffle-contract')
    Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))
    Math.setProvider(deployer.provider)
  }

  return {
    Math
  }
}

module.exports = migrate
