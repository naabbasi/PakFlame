echo Compiling and Generating webassembly
set GOOS=js
set GOARCH=wasm
set WASM_EXEC_PATH=%GOROOT%\misc\wasm\wasm_exec.js

echo GOROOT %GOROOT%
echo GOPATH %GOPATH%
echo WASM_EXEC_PATH %WASM_EXEC_PATH%

%GOROOT%\bin\go build -o ../app/build/static/lib.wasm hello.go
xcopy "%GOROOT%\misc\wasm\wasm_exec.js" "../app/build/static/js"