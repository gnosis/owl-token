const MathLib = artifacts.require('Math')
const TokenOWLUpdate = artifacts.require('TokenOWLUpdate')

module.exports = function(deployer) {
	deployer.link(MathLib, TokenOWLUpdate)
}
