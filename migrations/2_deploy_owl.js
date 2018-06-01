/* global artifacts */
/* eslint no-undef: "error" */

const contract = require('truffle-contract')

const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const ProxyMaster = artifacts.require('ProxyMaster')

const Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))

module.exports = function (deployer) {
  return deployer
    .then(Math.deployed())
    .then(() => deployer.link(MathLib, [TokenOWL, TokenOWLProxy, ProxyMaster]))
  	.then(() => deployer.deploy(TokenOWL))
  	.then(tokenOwl => deployer.deploy(TokenOWLProxy, tokenOwl.address))
}
