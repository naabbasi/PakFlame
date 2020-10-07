@echo off
set GOOS=windows
set GOARCH=amd64
set CURR_DIR=%cd%
echo GOROOT %GOROOT%

echo Checking new changes from server
git pull origin master

echo Downloading project dependencies
cd src\github.com\pakflame
%GOROOT%\bin\go get ./...

%GOROOT%\bin\go build -o ../../../bin/PakFlame.exe github.com/pakflame/rest/main/

cd %CURR_DIR%

echo "Building frontend"
cd src\github.com\pakflame\app
call npm run build

cd ..
cd webassembly
call buildWebAssembly.cmd

echo Copying frontend to bin folder
cd ..
echo %cd%
xcopy /E /Y app\build\* ..\..\..\bin\app\
