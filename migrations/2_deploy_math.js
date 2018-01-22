const MathLib = artifacts.require('Math');

module.exports = function(deployer) {
  deployer.deploy(MathLib)
}
