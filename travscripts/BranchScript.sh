#!/bin/bash

if [[ $TRAVIS_BRANCH = "master" || $TRAVIS_BRANCH = "develop" || $TRAVIS_BRANCH = "fixxing/tests"]]; then
  echo " ==> Detected PRINCIPAL branch - compiling and testing contracts"
  #jump back to root
  cd $TRAVIS_BUILD_DIR
  echo " ==> JUMPING LOCATIONS: NOW IN $TRAVIS_BUILD_DIR"

  # running contracts tests
  echo " ==> RUNNING test"
  npm test;
else
  echo " ==> No execution for branches other than MASTER or DEVELOP"
fi;
# testing
