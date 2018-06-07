function migrate (artifacts, deployer, network, accounts) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const Math = artifacts.require('Math')

  return deployer
    .then(() => Math.deployed())
    .then(() => deployer.link(Math, [ TokenOWL, TokenOWLProxy ]))
    .then(() => deployer.deploy(TokenOWL))
    .then(() => deployer.deploy(TokenOWLProxy, TokenOWL.address))
}

module.exports = migrate
