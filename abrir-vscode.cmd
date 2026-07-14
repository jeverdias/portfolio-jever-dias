@echo off
setlocal
set "WORKSPACE=%~dp0Site JD.code-workspace"
set "CODE_USER=%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe"
set "CODE_MACHINE=%ProgramFiles%\Microsoft VS Code\Code.exe"
set "CODE_X86=%ProgramFiles(x86)%\Microsoft VS Code\Code.exe"

where code.cmd >nul 2>nul
if not errorlevel 1 (
  start "" code.cmd "%WORKSPACE%"
  exit /b 0
)

if exist "%CODE_USER%" (
  start "" "%CODE_USER%" "%WORKSPACE%"
  exit /b 0
)

if exist "%CODE_MACHINE%" (
  start "" "%CODE_MACHINE%" "%WORKSPACE%"
  exit /b 0
)

if exist "%CODE_X86%" (
  start "" "%CODE_X86%" "%WORKSPACE%"
  exit /b 0
)

echo.
echo VS Code nao encontrado neste computador.
echo Instale em https://code.visualstudio.com/ e execute este arquivo novamente.
echo O workspace ja esta pronto em:
echo %WORKSPACE%
echo.
pause
exit /b 1
