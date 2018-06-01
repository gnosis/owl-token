# OWL Token
The OWL token and related smart contracts.

The token and contract can be in **Etherscan**:

* **Mainnet**: Not yet deployed
* **Rinkeby**:
  * TokenOWL: [https://rinkeby.etherscan.io/token/0x6388f297c3fc5b7ff879181fc337efe14e016865]()
  * TokenOWLProxy: [https://rinkeby.etherscan.io/token/0x540dc940c39166e8fa16ccb6686a088e567f1a79]()
  * OWLAirdrop: Not yet deployed
* **Kovan**:
  * TokenOWL: [https://kovan.etherscan.io/token/0x6388f297c3fc5b7ff879181fc337efe14e016865]()
  * TokenOWLProxy: [https://kovan.etherscan.io/token/0x540dc940c39166e8fa16ccb6686a088e567f1a79]()
  * OWLAirdrop: Not yet deployed
  

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
```

## Generate a new version
```bash
# In a release branch (i.e. release/vX.Y.X)
# Migrate the version to the testnets, at least rinkeby, and posibly mainnet
# You can optionally change the gas price using the GAS_PRICE env variable
yarn compile
yarn networks-inject
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