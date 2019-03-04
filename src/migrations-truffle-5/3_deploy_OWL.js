async function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')

  console.log('Deploy TokenOWL')
  await deployer.deploy(TokenOWL)

  console.log('Deploy TokenOWLProxy')
  console.log('  - owl master address: %s', TokenOWL.address)
  await deployer.deploy(TokenOWLProxy, TokenOWL.address)
}

module.exports = migrate
