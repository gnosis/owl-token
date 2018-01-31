const MathLib = artifacts.require('Math')
const TokenOWL = artifacts.require('TokenOWL')
const ProxyMaster = artifacts.require('ProxyMaster')

module.exports = function(deployer) {
  deployer.deploy(MathLib)
	.then(() => deployer.link(MathLib, TokenOWL))
  	.then(() => deployer.deploy(TokenOWL))
  	.then(() => deployer.deploy(ProxyMaster, TokenOWL.address))
  	.then(() => ProxyMaster.deployed())
  	.then((p) => TokenOWL.at(p.address).setupTokenOWL())
}
