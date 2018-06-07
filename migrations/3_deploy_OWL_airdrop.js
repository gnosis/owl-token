/* global artifacts */
/* eslint no-undef: "error" */

const contract = require('truffle-contract')

const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const OWLAirdrop = artifacts.require('OWLAirdrop')

const Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))
const TokenGNO = contract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))

const GNO_LOCK_PERIOD_IN_HOURS = process.env.GNO_LOCK_PERIOD_IN_HOURS || 30 * 24 // 30 days

module.exports = function (deployer) {
  Math.setProvider(deployer.provider)
  TokenGNO.setProvider(deployer.provider)

  return deployer
    .then(() => Math.deployed())
    .then(() => TokenGNO.deployed())
    .then(() => TokenOWL.deployed())
    .then((tokenOwl) => TokenOWLProxy.deployed())
    .then(() => deployer.link(Math, [ OWLAirdrop ]))
    .then(() => getTime())
    .then(time => {
      const owlProxyAddress = TokenOWLProxy.address
      const gnoAddress = TokenGNO.address
      const endTime = time + GNO_LOCK_PERIOD_IN_HOURS * 60 * 60

      console.log('Deploy AirDrop:')
      console.log('\t OWL proxy address: %s', owlProxyAddress)
      console.log('\t GNO address: %s', gnoAddress)
      console.log('\t End time: %s', new Date(endTime * 1000))

      return deployer.deploy(
        OWLAirdrop,
        owlProxyAddress,
        gnoAddress,
        endTime
      )
    })
}

function getTime () {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock('latest', (err, block) => {
      if (err) {
        return reject(err)
      } else {
        resolve(block.timestamp)
      }
    })
  })
}

