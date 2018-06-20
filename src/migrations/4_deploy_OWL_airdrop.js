const GNO_LOCK_PERIOD_IN_HOURS = 30 * 24 // 30 days

function migrate ({
  artifacts,
  deployer,
  network,
  accounts,
  web3,
  gnoLockEndTime = _getDefaultLockEndTime()
}) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')
  const { Math, TokenGNO } = _getDependencies(artifacts, network, deployer)

  return deployer
    .then(() => Math.deployed())
    .then(() => TokenGNO.deployed())
    .then(() => TokenOWL.deployed())
    .then(() => TokenOWLProxy.deployed())
    .then(() => deployer.link(Math, [ OWLAirdrop ]))
    .then(() => {
      const owlProxyAddress = TokenOWLProxy.address
      const gnoAddress = TokenGNO.address

      console.log('Deploy AirDrop:')
      console.log('\t OWL proxy address: %s', owlProxyAddress)
      console.log('\t GNO address: %s', gnoAddress)
      console.log('\t End time: %s', gnoLockEndTime)

      return deployer.deploy(
        OWLAirdrop,
        owlProxyAddress,
        gnoAddress,
        gnoLockEndTime.getTime() / 1000
      )
    })
}

function _getDefaultLockEndTime () {
  const now = new Date()
  return new Date(now.getTime() + GNO_LOCK_PERIOD_IN_HOURS * 60 * 60 * 1000)
}

function _getDependencies (artifacts, network, deployer) {
  let Math, TokenGNO
  if (network === 'development') {
    Math = artifacts.require('Math')
    TokenGNO = artifacts.require('TokenGNO')
  } else {
    const contract = require('truffle-contract')
    Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))
    Math.setProvider(deployer.provider)
    TokenGNO = contract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))
    TokenGNO.setProvider(deployer.provider)
  }

  return {
    Math,
    TokenGNO
  }
}

module.exports = migrate
