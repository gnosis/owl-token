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
  const { TokenGNO } = _getDependencies(artifacts, network, deployer)

  const tokenGno = await TokenGNO.deployed()
  await TokenOWL.deployed()
  const tokenOWLProxy = await TokenOWLProxy.deployed()

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

const network2id = {
  mainnet: 1,
  kovan: 42,
  rinkeby: 4,
  ropsten: 3
}

function _getDependencies (artifacts, network, deployer) {
  let TokenGNO

  if (network === 'development') {
    TokenGNO = artifacts.require('TokenGNO')
  } else {
    const contract = require('truffle-contract')

    TokenGNO = contract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))
    TokenGNO.setProvider(deployer.provider)
    TokenGNO.setNetwork(network2id[network.replace('-fork', '')])
  }

  return {
    TokenGNO
  }
}

module.exports = migrate
