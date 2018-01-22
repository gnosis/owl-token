const TokenOWL = artifacts.require('TokenOWL')

module.exports = function(deployer) {
  deployer.deploy(TokenOWL)
}
