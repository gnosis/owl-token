#!/bin/bash

echo " ==> Detected PRINCIPAL branch - compiling and testing contracts"
#jump back to root
cd $TRAVIS_BUILD_DIR
echo " ==> JUMPING LOCATIONS: NOW IN $TRAVIS_BUILD_DIR"

# compiling contracts
echo " ==> COMPILING contracts"
npm run compile;

ls build/contracts/

# running contracts tests
echo " ==> RUNNING test"
npm test;
