@echo off
setlocal enabledelayedexpansion

REM Buscar la línea que contiene "IPv4" y extraer la IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
)

REM Abrir directamente en navegador predeterminado
start http://%IP%/MantStock/index.html
