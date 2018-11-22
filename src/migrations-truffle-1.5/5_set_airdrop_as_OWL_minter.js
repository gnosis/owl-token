async function migrate ({ artifacts, accounts }) {
  const owner = accounts[0]
  const TokenOWL = artifacts.require('TokenOWL')
  const TokenOWLProxy = artifacts.require('TokenOWLProxy')
  const OWLAirdrop = artifacts.require('OWLAirdrop')

  await TokenOWL.deployed()
  const owlAirdrop = await OWLAirdrop.deployed()
  const tokenOwlProxy = await TokenOWLProxy.deployed()

  console.log('Set AirDrop as OWL minter')
  console.log('\t Airdrop address: %s', owlAirdrop.address)
  console.log('\t Owner: %s', owner)
  console.log('\t OWL Proxy address: %s', tokenOwlProxy.address)
  const owl = TokenOWL.at(tokenOwlProxy.address)
  await owl.setMinter(owlAirdrop.address)
}

module.exports = migrate
