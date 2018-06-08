# OWL Token
The OWL token and related smart contracts.

The token and contract can be in **Etherscan**:

* **Mainnet**: Not yet deployed
* **Rinkeby**:
  * TokenOWL: [https://rinkeby.etherscan.io/token/0x3414655806e34e2f55dd96fd1e6beafff33b9382]()
  * TokenOWLProxy: [https://rinkeby.etherscan.io/token/0x031cc2c635695c9bdb563a3541e5914fe22b5a95]()
  * OWLAirdrop: [https://rinkeby.etherscan.io/token/0xa4912dce7d37111ba534409e76187fe6677d5319]()
  
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

# Execute the migrations for the dependencies
yarn migrate-dep

# Execute the migrations
yarn migrate

# Or you can do all at once using
yarn migrate-all
```

## Change the lock period time
The deployment script has an environemt variable `GNO_LOCK_PERIOD_IN_HOURS` that 
allows you to set a different lock period (`30 days` by default).

```bash
# Deploy for develop with just 1h lock perio
GNO_LOCK_PERIOD_IN_HOURS=1 yarn migrate
```

## Generate a new version
```bash
# In a release branch (i.e. release/vX.Y.X)
# Migrate the version to the testnets, at least rinkeby, and posibly mainnet
# You can optionally change the gas price using the GAS_PRICE env variable
yarn restore
MNEMONIC=$MNEMONIC_OWL yarn migrate --network rinkeby

# Extract the network file
yarn networks-extract

# Verify the contract in Etherscan
# Folow the steps in "Verify contract"

# Commit the network file
git add network.json
git commit -m 'Update the networks file'

# Generate version using Semantic Version: https://semver.org/
# For example, for a minor version
npm version minor
git push
git push --tags

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