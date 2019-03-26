const GNO_LOCK_PERIOD_IN_HOURS = 30 * 24 // 30 days
const OWL_PER_GNO = 2

async function migrate ({
  artifacts,
  deployer,
  network,
  web3,
  gnoLockEndTime = _getDefaultLockEndTime(),
  multiplier = OWL_PER_GNO
}) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')
  const { Math: MathLib, TokenGNO } = await _getDependencies(artifacts, network, deployer, web3)

  await MathLib.deployed()
  const tokenGno = await TokenGNO.deployed()
  await TokenOWL.deployed()
  const tokenOWLProxy = await TokenOWLProxy.deployed()
  await deployer.link(MathLib, [OWLAirdrop])

  const owlProxyAddress = tokenOWLProxy.address
  const gnoAddress = tokenGno.address

  console.log('Deploy OWLAirdrop:')
  console.log('\t OWL proxy address: %s', owlProxyAddress)
  console.log('\t GNO address: %s', gnoAddress)
  console.log('\t End time: %s', gnoLockEndTime)
  console.log('\t OWL multiplier: %s', multiplier)

  const BN = web3.utils.BN
  const gnoLockEndTimeBN = new BN(gnoLockEndTime.getTime() / 1000)
  return deployer.deploy(
    OWLAirdrop,
    owlProxyAddress,
    gnoAddress,
    gnoLockEndTimeBN,
    multiplier
  )
}

function _getDefaultLockEndTime () {
  const now = new Date()
  return new Date(now.getTime() + GNO_LOCK_PERIOD_IN_HOURS * 60 * 60 * 1000)
}

async function _getDependencies (artifacts, network, deployer, web3) {
  let Math, TokenGNO
  if (network === 'development') {
    Math = artifacts.require('GnosisMath')
    TokenGNO = artifacts.require('TokenGNO')
  } else {
    const contract = require('truffle-contract')
    Math = contract(require('@gnosis.pm/util-contracts/build/contracts/GnosisMath'))
    Math.setProvider(deployer.provider)

    const networkId = await web3.eth.net.getId()

    Math.setNetwork(networkId)

    TokenGNO = contract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))
    TokenGNO.setProvider(deployer.provider)
    TokenGNO.setNetwork(networkId)
  }

  return {
    Math,
    TokenGNO
  }
}

module.exports = migrate
