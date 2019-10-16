#!/usr/bin/env bash

export GOOS=linux
export GOARCH=amd64

echo GOROOT $GOROOT
echo GOPATH $GOPATH

$GOROOT/bin/dep ensure

$GOROOT/bin/go build -o ../../../bin/AbuZarTrader github.com/sanitary/rest/main/

cd app
npm run build

cd ..
cd webassembly
./buildWebAssembly.sh

echo Copying frontend to bin folder
cd ..
mkdir -p ../../../bin/app/
cp -r app/build/* ../../../bin/app/
