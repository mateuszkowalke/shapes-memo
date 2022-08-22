#!/bin/bash

# abort on errors
set -e

rm -rf dist

# build
npm run build

# navigate into the build output directory
cd dist

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:mateuszkowalke/shapes-memo.git main:gh-pages

cd -

