#!/bin/bash -eux

export PREPARE_NO_BUILD=true

yarn install


for package in packages/react-web-runtime platform/host-test; do
  pushd $package
  yarn install
  popd
done

nx run-many --target=build
