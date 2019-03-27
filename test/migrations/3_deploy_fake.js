/* global artifacts */

const MathLib = artifacts.require('GnosisMath')
const FakeToken = artifacts.require('FakeToken')

module.exports = function (deployer) {
  deployer.link(MathLib, FakeToken)
  deployer.deploy(FakeToken)
}
