const truffleConfig = require('./truffle.js')

module.exports = {
  ...truffleConfig,
  contracts_directory: './contracts/4/',
  compilers: {
    solc: {
      version: '0.4.24',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
