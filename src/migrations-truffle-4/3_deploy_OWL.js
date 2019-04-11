function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')

  return deployer
    .then(() => deployer.deploy(TokenOWL))
    .then(() => deployer.deploy(TokenOWLProxy, TokenOWL.address))
}

module.exports = migrate
