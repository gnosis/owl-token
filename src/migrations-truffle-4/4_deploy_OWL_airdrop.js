const GNO_LOCK_PERIOD_IN_HOURS = 30 * 24 // 30 days
const OWL_PER_GNO = 2

function migrate ({
  artifacts,
  deployer,
  network,
  accounts,
  web3,
  gnoLockEndTime = _getDefaultLockEndTime(),
  multiplier = OWL_PER_GNO
}) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')
  const { TokenGNO } = _getDependencies(artifacts, network, deployer)

  return deployer
    .then(() => TokenGNO.deployed())
    .then(() => TokenOWL.deployed())
    .then(() => TokenOWLProxy.deployed())
    .then(() => {
      const owlProxyAddress = TokenOWLProxy.address
      const gnoAddress = TokenGNO.address

      console.log('Deploy AirDrop:')
      console.log('\t OWL proxy address: %s', owlProxyAddress)
      console.log('\t GNO address: %s', gnoAddress)
      console.log('\t End time: %s', gnoLockEndTime)
      console.log('\t OWL multiplier: %s', multiplier)

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
  let TokenGNO
  if (network === 'development') {
    TokenGNO = artifacts.require('TokenGNO')
  } else {
    const contract = require('truffle-contract')
    Math.setProvider(deployer.provider)
    TokenGNO = contract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))
    TokenGNO.setProvider(deployer.provider)
  }

  return {
    TokenGNO
  }
}

module.exports = migrate
