#!/bin/bash

echo " ==> Detected PRINCIPAL branch - compiling and testing contracts"
#jump back to root
pwd
cd $TRAVIS_BUILD_DIR
echo " ==> JUMPING LOCATIONS: NOW IN $TRAVIS_BUILD_DIR"

# compiling contracts
echo " ==> COMPILING contracts"
yarn compile;

# running contracts tests
echo " ==> RUNNING test"
yarn test;
