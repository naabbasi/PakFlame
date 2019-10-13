@echo off
set GOOS=windows
set GOARCH=amd64

echo GOROOT %GOROOT%
echo GOPATH %GOPATH%

%GOROOT%\bin\dep ensure

%GOROOT%\bin\go build -o ../../../bin/AbuZarTrader.exe github.com/sanitary/rest/main/

cd app
call npm run build

cd ..
cd webassembly
call buildWebAssembly.cmd

echo Copying frontend to bin folder
cd ..
echo %cd%
xcopy /E /Y app\build\* ..\..\..\bin\app\
