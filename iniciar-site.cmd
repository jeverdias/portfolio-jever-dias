@echo off
setlocal
title Portfolio Jever Dias - Servidor local

cd /d "%~dp0"

set "NODE_EXE=C:\Users\jever\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "VITE_JS=%~dp0node_modules\vite\bin\vite.js"

if not exist "%NODE_EXE%" (
  echo.
  echo ERRO: o Node.js usado para criar o projeto nao foi encontrado.
  echo Instale o Node.js LTS em https://nodejs.org/ e execute: npm install
  echo.
  pause
  exit /b 1
)

if not exist "%VITE_JS%" (
  echo.
  echo ERRO: as dependencias do projeto nao foram encontradas.
  echo Abra o projeto no Codex para instalar as dependencias ou instale o Node.js LTS.
  echo.
  pause
  exit /b 1
)

echo.
echo Iniciando o Portfolio Jever Dias...
echo O navegador sera aberto automaticamente.
echo Para encerrar, pressione CTRL+C.
echo.

"%NODE_EXE%" "%VITE_JS%" --host 127.0.0.1 --port 4173 --open

echo.
echo O servidor foi encerrado.
pause
