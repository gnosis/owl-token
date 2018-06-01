const MathLib = artifacts.require('Math')
const FakeToken = artifacts.require('FakeToken')

module.exports = function (deployer) {
  deployer.link(MathLib, FakeToken)
  deployer.deploy(FakeToken)
}
