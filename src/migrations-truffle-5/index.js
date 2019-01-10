const migrateDependencies = require('./2_DEV_migrate_dependencies')
const deployOwl = require('./3_deploy_OWL')
const deployOwlAirdrop = require('./4_deploy_OWL_airdrop')
const setAirdropAsOwlMinter = require('./5_set_airdrop_as_OWL_minter')

module.exports = async params => {
  await migrateDependencies(params)
  await deployOwl(params)
  await deployOwlAirdrop(params)
  await setAirdropAsOwlMinter(params)
}
