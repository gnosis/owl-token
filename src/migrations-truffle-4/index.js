const migrateDependencies = require('./2_DEV_migrate_dependencies')
const deployOwl = require('./3_deploy_OWL')
const deployOwlAirdrop = require('./4_deploy_OWL_airdrop')
const setAirdropAsOwlMinter = require('./5_set_airdrop_as_OWL_minter')

module.exports = params => {
  return params.deployer
    .then(() => migrateDependencies(params))
    .then(() => deployOwl(params))
    .then(() => deployOwlAirdrop(params))
    .then(() => setAirdropAsOwlMinter(params))
}
