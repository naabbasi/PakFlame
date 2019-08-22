@echo off
set current_dir = %cd%

%GOROOT%\bin\dep ensure

%GOROOT%\bin\go build -o ../../../bin/app.exe github.com/darzi/rest/main

cd webassembly

call buildWebAssembly.cmd

cd ..

xcopy /E /Y frontend\assets %cd%\..\..\..\bin\assets\
xcopy /E /Y frontend\views %cd%\..\..\..\bin\views\