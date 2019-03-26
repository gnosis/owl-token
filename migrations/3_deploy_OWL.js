/* global artifacts, web3 */
/* eslint no-undef: "error" */

const deployOwl = require('../src/migrations-truffle-5/3_deploy_OWL')
const TokenOWL = artifacts.require('TokenOWL')
const TokenOWLProxy = artifacts.require('TokenOWLProxy')

module.exports = async function (deployer, network, accounts) {
  let canSetMinter = false
  try {
    const tokenOWL = await TokenOWL.at(TokenOWLProxy.address)
    const creator = await tokenOWL.creator()

    canSetMinter = accounts[0].toLowerCase() === creator.toLowerCase()
  } catch (error) {

  }

  if (canSetMinter) {
    console.log('Can setMinter on already available TokenOWL. No need to redeploy')
    return
  }

  console.log('Deploying account can\'t change TokenOWL minter')
  console.log('Deploying a new TokenOWl and TokenOWLProxy for testing')

  return deployOwl({
    artifacts,
    deployer,
    network,
    accounts,
    web3
  })
}
