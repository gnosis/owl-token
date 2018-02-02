const MathLib = artifacts.require('Math')
const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const ProxyMaster = artifacts.require('ProxyMaster')

module.exports = function(deployer) {
  deployer.deploy(MathLib)
	.then(() => deployer.link(MathLib, [TokenOWL, TokenOWLProxy, ProxyMaster]))
  	.then(() => deployer.deploy(TokenOWL))
  	.then(() => deployer.deploy(TokenOWLProxy, TokenOWL.address))
}
