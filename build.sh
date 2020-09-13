#!/usr/bin/env bash

export GOOS=linux
export GOARCH=amd64
export CURRENT_DIR=$(pwd)
echo GOROOT $GOROOT
echo $CURRENT_DIR

rm -vfr $CURRENT_DIR/bin/*

cd $CURRENT_DIR/src/github.com/pakflame

$GOROOT/bin/go get ./...

$GOROOT/bin/go build -o ../../../bin/AbuZarTrader github.com/pakflame/rest/main/

cd app
npm run build

cd ..
cd webassembly
./buildWebAssembly.sh

echo Copying frontend to bin folder
cd ..
mkdir -p ../../../bin/app/
cp -r app/build/* ../../../bin/app/
