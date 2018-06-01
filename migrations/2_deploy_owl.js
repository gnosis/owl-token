/* global artifacts */
/* eslint no-undef: "error" */

const contract = require('truffle-contract')

const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')

const Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))
const ProxyMaster = contract(require('@gnosis.pm/util-contracts/build/contracts/Proxy'))

module.exports = function (deployer) {
  Math.setProvider(deployer.provider)
  // ProxyMaster.setProvider(deployer.provider)

  return deployer
    .then(() => Math.deployed())
    .then(() => deployer.link(Math, [ TokenOWL, TokenOWLProxy ]))
  	.then(() => deployer.deploy(TokenOWL))
  	.then(() => deployer.deploy(TokenOWLProxy, TokenOWL.address))
}
