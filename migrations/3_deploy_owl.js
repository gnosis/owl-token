const MathLib = artifacts.require('Math')
const TokenOWL = artifacts.require('TokenOWL')

module.exports = function(deployer) {
  deployer.link(MathLib, TokenOWL)
  deployer.deploy(TokenOWL)
}
