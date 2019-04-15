async function migrate ({ artifacts, deployer, network, accounts, web3 }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')

  console.log('Deploy TokenOWL')
  await deployer.deploy(TokenOWL)

  if (process.env.DEPLOY_OWL_ONLY && !process.env.DEPLOY_OWL_PROXY) {
    console.log(`TokenOWL is deployed at ${TokenOWL.address}
    If need be, update TokenOWLProxy to point to that address:
    TokenOWLProxy.startMasterCopyCountdown(${TokenOWL.address})
    and after the time period
    TokenOWLProxy.updateMasterCopy()
    `)
    return
  }

  console.log('Deploy TokenOWLProxy')
  console.log('  - owl master address: %s', TokenOWL.address)
  await deployer.deploy(TokenOWLProxy, TokenOWL.address)
}

module.exports = migrate
