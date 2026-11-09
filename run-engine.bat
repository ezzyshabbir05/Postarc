@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo               Postarc Engine Local Runner
echo ========================================================
echo.

if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [INFO] Created .env from .env.example template.
    ) else (
        echo [ERROR] .env file not found and .env.example missing.
        exit /b 1
    )
)

echo [1/3] Checking Docker daemon status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker daemon is not running or docker CLI is not installed.
    echo Please start Docker Desktop and run this script again.
    pause
    exit /b 1
)

echo [2/3] Starting Postarc Engine backend services (db, redis, engine)...
docker compose up -d db redis engine

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Postarc Engine services via docker-compose.
    pause
    exit /b 1
)

echo.
echo [3/3] Postarc Engine backend services are active!
echo --------------------------------------------------------
echo  - Postarc JMAP/HTTP API:  http://localhost:8080/jmap/
echo  - Postarc SMTP:           localhost:25, 465, 587
echo  - Postarc IMAP:           localhost:143, 993
echo  - Postarc POP3:           localhost:110, 995
echo  - ManageSieve:            localhost:4190
echo --------------------------------------------------------
echo.
echo To run the Webmail & Admin UI locally with hot-reload:
echo   cd web
echo   npm run dev
echo.
echo To view live logs from the Postarc Engine:
echo   docker compose logs -f engine
echo.
pause
