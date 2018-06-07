async function migrate (artifacts, deployer, network, accounts, web3) {
  const contract = require('truffle-contract')

  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')
  const Math = artifacts.require('Math')
  const TokenGNO = artifacts.require('TokenGNO')
  
  const GNO_LOCK_PERIOD_IN_HOURS = process.env.GNO_LOCK_PERIOD_IN_HOURS || 30 * 24 // 30 days

  return deployer
    .then(() => Math.deployed())
    .then(() => TokenGNO.deployed())
    .then(() => TokenOWL.deployed())
    .then((tokenOwl) => TokenOWLProxy.deployed())
    .then(() => deployer.link(Math, [ OWLAirdrop ]))
    .then(() => getTime(web3))
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

function getTime (web3) {
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

