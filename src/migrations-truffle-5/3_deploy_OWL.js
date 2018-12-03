async function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const { Math } = _getDependencies(artifacts, network, deployer)

  console.log('Link Math lib to TokenOWL and TokenOWLProxy')
  await Math.deployed()
  await deployer.link(Math, [ TokenOWL, TokenOWLProxy ])

  console.log('Deploy TokenOWL')
  const tokenOWL = await deployer.deploy(TokenOWL)

  console.log('Deploy TokenOWLProxy')
  console.log('  - owl master address: %s', tokenOWL.address)
  await deployer.deploy(TokenOWLProxy, tokenOWL.address)
}

function _getDependencies (artifacts, network, deployer) {
  let Math
  if (network === 'development') {
    Math = artifacts.require('Math')
  } else {
    const contract = require('truffle-contract')
    Math = contract(require('@gnosis.pm/util-contracts/build/contracts/Math'))
    Math.setProvider(deployer.provider)
  }

  return {
    Math
  }
}

module.exports = migrate
