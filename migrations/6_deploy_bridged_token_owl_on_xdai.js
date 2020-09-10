/* global artifacts, web3 */

const BridgedTokenOWL = artifacts.require('BridgedTokenOWL')

module.exports = async function (deployer, network, accounts) {
  if (process.env.DEPLOY_OWL_ONLY) {
    console.log('Only deploying TokenOWL in this run')
    return
  }

  // Todo parametrize if needed
  const name = 'OWL on xDAI'
  const symbol = 'xOWL'
  const burnReceiver = accounts[0]
  const chainId = await web3.eth.net.getId()

  await deployer.deploy(BridgedTokenOWL, name, symbol, 18, chainId, burnReceiver)
}
