/* global artifacts */
/* eslint no-undef: "error" */

const contract = require('truffle-contract')

const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')
const OWLAirdrop = artifacts.require('OWLAirdrop')

const Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))
const ProxyMaster = contract(require('@gnosis.pm/util-contracts/build/contracts/Proxy'))
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
    .then(time => deployer.deploy(
      OWLAirdrop,
      TokenOWLProxy.address,
      TokenGNO.address,
      (time + GNO_LOCK_PERIOD_IN_HOURS * 60 * 60)
    ))
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


// // TokenOWL _tokenOWL, Token _tokenGNO, uint _endTime
// .then(t => deployer.deploy(OWLAirdrop, TokenOWLProxy.address, TokenGNO.address, (t + 30 * 24 * 60 * 60))) // in 30 days
// .then(() => TokenOWLProxy.deployed())
// .then(T => TokenOWL.at(T.address).setMinter(OWLAirdrop.address))