const GNO_LOCK_PERIOD_IN_HOURS = 30 * 24 // 30 days

function migrate ({
  artifacts,
  deployer,
  network,
  accounts,
  web3,
  gnoLockPeriodInHours = GNO_LOCK_PERIOD_IN_HOURS
}) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')  
  const { Math, TokenGNO } = _getDependencies(artifacts, network, deployer)

  return deployer
    .then(() => Math.deployed())
    .then(() => TokenGNO.deployed())
    .then(() => TokenOWL.deployed())
    .then(tokenOwl => TokenOWLProxy.deployed())
    .then(() => deployer.link(Math, [ OWLAirdrop ]))
    .then(() => _getTime(web3))
    .then(time => {
      const owlProxyAddress = TokenOWLProxy.address
      const gnoAddress = TokenGNO.address
      const endTime = time + gnoLockPeriodInHours * 60 * 60

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

function _getTime (web3) {
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

module.exports = migrate
