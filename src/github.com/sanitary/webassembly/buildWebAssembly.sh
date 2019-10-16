#!/usr/bin/env bash
echo Compiling and Generating webassembly
export GOOS=js
export GOARCH=wasm
export WASM_EXEC_PATH=$GOROOT/misc/wasm/wasm_exec.js

echo GOROOT $GOROOT
echo GOPATH $GOPATH
echo WASM_EXEC_PATH $WASM_EXEC_PATH

$GOROOT/bin/go build -o ../app/build/static/lib.wasm hello.go
cp $GOROOT/misc/wasm/wasm_exec.js ../app/build/static/js