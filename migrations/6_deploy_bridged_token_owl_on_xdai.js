/* global artifacts, web3 */

const BridgedTokenOWL = artifacts.require('BridgedTokenOWL')

module.exports = async function (deployer, network, accounts) {
  const chainId = await web3.eth.net.getId()
  if (chainId !== 100) {
    console.log('Only deploying bridged OWL on xDAI')
    return
  }

  // Todo parametrize if needed
  const name = 'OWL on xDAI'
  const symbol = 'xOWL'
  const burnReceiver = accounts[0]

  await deployer.deploy(BridgedTokenOWL, name, symbol, 18, chainId, burnReceiver)
}
