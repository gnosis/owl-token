async function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const { Math } = await _getDependencies(artifacts, network, deployer, web3)

  console.log('Link Math lib to TokenOWL and TokenOWLProxy')
  await Math.deployed()
  await deployer.link(Math, [ TokenOWL, TokenOWLProxy ])

  console.log('Deploy TokenOWL')
  const tokenOWL = await deployer.deploy(TokenOWL)

  console.log('Deploy TokenOWLProxy')
  console.log('  - owl master address: %s', tokenOWL.address)
  await deployer.deploy(TokenOWLProxy, tokenOWL.address)
}

async function _getDependencies (artifacts, network, deployer, web3) {
  let Math
  if (network === 'development') {
    Math = artifacts.require('GnosisMath')
  } else {
    const contract = require('truffle-contract')
    Math = contract(require('@gnosis.pm/util-contracts/build/contracts/GnosisMath'))
    Math.setProvider(web3.currentProvider)

    // await Math.detectNetwork() should work but doesn't
    Math.setNetwork(await web3.eth.net.getId())
  }

  return {
    Math
  }
}

module.exports = migrate
