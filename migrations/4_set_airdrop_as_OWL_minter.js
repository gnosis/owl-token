/* global artifacts */
/* eslint no-undef: "error" */
const contract = require('truffle-contract')

const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const OWLAirdrop = artifacts.require('OWLAirdrop')

const GNO_LOCK_PERIOD_IN_HOURS = process.env.GNO_LOCK_PERIOD_IN_HOURS || 30 * 24 // 30 days

module.exports = function (deployer, network, accounts) {
  return deployer
    .then(() => TokenOWL.deployed())
    .then(() => TokenOWLProxy.deployed())
    // Set the AirDrop as OWL minter
    .then(() => {
      const airdropAddress = OWLAirdrop.address
      const owlProxyAddress = TokenOWLProxy.address
      const owner = accounts[0]

      console.log('Set AirDrop as OWL minter')
      console.log('\t Airdrop address: %s', airdropAddress)
      console.log('\t Owner: %s', owner)
      console.log('\t OWL Proxy address: %s', owlProxyAddress)

      const owl = TokenOWL.at(owlProxyAddress)
      owl.setMinter(airdropAddress, {
        from: owner
      })
    })
}