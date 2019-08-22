echo GOPATH=E:\Learning\go-lang\workspace\darzi
set GOOS=js
set GOARCH=wasm

%GOROOT%\bin\go build -o ../frontend/assets/lib.wasm hello.go

xcopy /Y %GOROOT%\misc\wasm\wasm_exec.js %cd%\..\frontend\assets\js\