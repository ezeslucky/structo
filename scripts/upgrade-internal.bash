#!/usr/bin/env bash

set -o errexit -o nounset -o

cd plixo


npx --yes concurrently \
  --kill-others-on-fail \
  --max-processes 7 \
  --timings \
  --names canvas-packages,host-test,loader-bundle-env,loader-html-hydrate,react-web-bundle,sub,wab \
  'cd canvas-packages && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  'cd host-test && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  'cd loader-bundle-env && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  'cd loader-html-hydrate && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  'cd react-web-bundle && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  'cd sub && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  'cd wab && flock /tmp/yarn-mutex yarn --mutex network upgrade --latest --pattern "@plasmic(app|pkgs)/*"' \
  # end
