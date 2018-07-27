# OWL Token
The OWL token and related smart contracts.

The token and contract can be in **Etherscan**:

* **Mainnet**: 
  * TokenOWL: [https://etherscan.io/token/0x694c68c7577a9a6a8cf2f6da0066790201afc260]()
  * TokenOWLProxy: [https://etherscan.io/token/0x1a5f9352af8af974bfc03399e3767df6370d82e4]()
  * OWLAirdrop: [https://etherscan.io/token/0x85e9fc8273b1ee9d81f4b800071563096f689863]()
* **Rinkeby**:
  * TokenOWL: [https://rinkeby.etherscan.io/token/0xff9874588b2358704832a380ca9892f0a1c57b40]()
  * TokenOWLProxy: [https://rinkeby.etherscan.io/token/0xa7d1c04faf998f9161fc9f800a99a809b84cfc9d]()
  * OWLAirdrop: [https://rinkeby.etherscan.io/token/0x9b816eb9fa1af7bc57a4d7ce059ed072d49d7830]()
  
## Setup and show the networks
```bash
# Install dependencies
yarn install

# Compile and restore the network addresses
yarn restore

# Show current network addresses
yarn networks
```

## Execute migrations into a local ganache-cli
```bash
# Run ganache CLU
yarn rpc

# Execute the migrations
yarn migrate

# Or you can do all at once using
yarn migrate-all
```

## Change the lock period time - re-deployment
The deployment script has an environemt variable `LOCK_END_TIME` that 
allows you to set a different lock period (`30 days` by default).

```bash
# Deploy for develop with a given end time for lock period
# flag --reset is NECESSARY as you are re-deploying
# 24H format, please be careful!
LOCK_END_TIME='2018-06-12T16:00:00+02:00' yarn migrate --reset
(npm) > LOCK_END_TIME='2018-06-12T16:00:00+02:00' npm run migrate -- --reset
```

## Generate a new version
```bash
# In a release branch (i.e. release/vX.Y.X)
# Migrate the version to the testnets, at least rinkeby, and posibly mainnet
# You can optionally change the gas price using the GAS_PRICE_GWEI env variable
# if you are changing LOCK_END_TIME here, flag --reset is NECESSARY as you are re-deploying
yarn restore
MNEMONIC=$MNEMONIC_OWL yarn migrate --network rinkeby
(npm) > MNEMONIC=$MNEMONIC_OWL npm run migrate -- --network rinkeby

# Extract the network file
yarn networks-extract

# Verify the contract in Etherscan
# Folow the steps in "Verify contract"

# Commit the network file
git add networks.json
git commit -m 'Updated the networks file'
> OR simply git commit -am 'Updated networks file'

# Generate version using Semantic Version: https://semver.org/
# For example, for a minor version
npm version minor
git push && git push --tags

# Deploy npm package
npm publish --access=public

# Merge tag into develop, to deploy it to production, also merge it into master
git checkout develop
git merge vX.Y.X
```

## Verify contract
Flatten the smart contract:
```bash
npx truffle-flattener contracts/TokenOWL.sol > build/TokenOWL-EtherScan.sol
npx truffle-flattener contracts/TokenOWLProxy.sol > build/TokenOWLProxy-EtherScan.sol
npx truffle-flattener contracts/OWLAirdrop.sol > build/OWLAirdrop-EtherScan.sol
```

Go to Etherscan validation page:
* Go to[https://rinkeby.etherscan.io/verifyContract?a=]()
* Fill the information:
  * Use `build/TokenOWL-EtherScan.sol`
  * Set the exact compiler version used for the compilation i.e. `v0.4.24+commit.e67f0147`
  * Optimization: `No`
* Press validate

# Change the owner
There's a script to change the OWL owner:

For example, to change the owner in `rinkeby` to `0xb65d2c1a4756ee857fca057ef561758b42277f5e`:
```bash
# Dry run 
MNEMONIC=$MNEMONIC_OWL yarn change-owner --owner 0xb65d2c1a4756ee857fca057ef561758b42277f5e --network rinkeby --dry-run

# Run the transaction
MNEMONIC=$MNEMONIC_OWL yarn change-owner --owner 0xb65d2c1a4756ee857fca057ef561758b42277f5e --network rinkeby
```

## License
[LGPL v3](./LICENSE)