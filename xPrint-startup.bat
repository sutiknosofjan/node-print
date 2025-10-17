@echo off

set NODE_PATH="c:\Program Files\nodejs\node.exe"
set APP_PATH="d:\xPrint\index.js"

cd /d "%~dp0"

start "xPrint Srv at background" %NODE_PATH% "%APP_PATH%"

exit