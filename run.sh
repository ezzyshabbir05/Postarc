#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from template."
fi

docker compose up -d
echo "Postarc stack started!"
echo "Webmail: http://localhost:3000/mail"
echo "Admin:   http://localhost:3000/admin"

