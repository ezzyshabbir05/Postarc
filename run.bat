@echo off
echo ========================================================
echo               Starting Postarc Local Stack
echo ========================================================

if not exist .env (
    copy .env.example .env
    echo Created .env from template.
)

docker compose up -d
if %errorlevel% neq 0 (
    echo Docker compose failed or Docker is not running.
    echo To run Next.js Web UI locally:
    echo   cd web
    echo   npm run dev
) else (
    echo Postarc stack started!
    echo Webmail: http://localhost:3000/mail
    echo Admin:   http://localhost:3000/admin
)

