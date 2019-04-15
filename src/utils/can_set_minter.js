async function canSetMinter ({ artifacts, accounts }) {
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')

  let canSetMinter = false
  try {
    const tokenOWL = await TokenOWL.at(TokenOWLProxy.address)
    const creator = await tokenOWL.creator()

    canSetMinter = accounts[0].toLowerCase() === creator.toLowerCase()
  } catch (error) {

  }

  return canSetMinter
}

module.exports = canSetMinter
