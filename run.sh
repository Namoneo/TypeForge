#!/usr/bin/env bash
# TypeForge — one-shot dev runner.
#
#   ./run.sh         start everything (docker + api + web)
#   ./run.sh down    stop docker services
#   ./run.sh seed    re-run the Prisma seed (wipes challenges)
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

DB_URL="postgresql://typeforge:typeforge@localhost:5432/typeforge"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }

require() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

ensure_port_free() {
  # A non-docker Postgres bound to :5432 will shadow the docker container on
  # loopback and cause P1010 auth errors during migrate/seed.
  local pids
  pids=$(lsof -nP -iTCP:5432 -sTCP:LISTEN 2>/dev/null | awk 'NR>1 && $1 !~ /docker|vpnkit|com\.docke/ {print $2}' | sort -u || true)
  [[ -z "$pids" ]] && return 0

  warn "A non-docker process is bound to port 5432 (PID(s): $pids)."
  warn "The docker Postgres will be shadowed; migrations will fail with P1010."

  if command -v brew >/dev/null 2>&1; then
    local svc
    svc=$(brew services list 2>/dev/null | awk '/^postgresql.*started/{print $1; exit}')
    if [[ -n "${svc:-}" ]]; then
      read -r -p "Stop Homebrew service '$svc'? [y/N] " ans
      if [[ "${ans:-}" =~ ^[Yy]$ ]]; then
        brew services stop "$svc"
        return 0
      fi
    fi
  fi
  die "Stop the conflicting Postgres manually, then re-run."
}

ensure_env_file() {
  local env_file="apps/api/.env"
  [[ -f "$env_file" ]] && return 0

  log "Creating $env_file from .env.example"
  cp "apps/api/.env.example" "$env_file"

  local jwt jwt_refresh
  jwt=$(openssl rand -base64 48 | tr -d '\n=+/' | cut -c1-48)
  jwt_refresh=$(openssl rand -base64 48 | tr -d '\n=+/' | cut -c1-48)

  # Match the docker-compose credentials and inject generated secrets.
  sed -i.bak \
    -e "s|postgresql://postgres:password@localhost:5432/typeforge|$DB_URL|" \
    -e "s|change-me-to-a-strong-random-secret|$jwt|" \
    -e "s|change-me-to-a-strong-random-refresh-secret|$jwt_refresh|" \
    "$env_file"
  rm -f "$env_file.bak"
}

wait_for_postgres() {
  log "Waiting for Postgres to accept connections"
  local i=0
  until docker compose exec -T postgres pg_isready -U typeforge >/dev/null 2>&1; do
    ((i++ >= 30)) && die "Postgres did not become ready in 30s"
    sleep 1
  done
}

challenges_already_seeded() {
  local count
  count=$(docker compose exec -T postgres psql -U typeforge -d typeforge -tAc \
    'select count(*) from challenges' 2>/dev/null || echo 0)
  [[ "${count:-0}" -gt 0 ]]
}

cmd_up() {
  require docker
  require node
  require npm
  require openssl
  require lsof

  ensure_port_free
  ensure_env_file

  log "Starting Postgres + Redis (docker compose)"
  docker compose up -d postgres redis

  if [[ ! -d node_modules ]]; then
    log "Installing npm dependencies (workspaces)"
    npm install
  fi

  wait_for_postgres

  log "Applying Prisma migrations"
  ( cd apps/api && DATABASE_URL="$DB_URL" npx prisma generate >/dev/null )
  ( cd apps/api && DATABASE_URL="$DB_URL" npx prisma migrate deploy )

  if challenges_already_seeded; then
    log "Database already seeded — skipping (use ./run.sh seed to force)"
  else
    log "Seeding database"
    ( cd apps/api && DATABASE_URL="$DB_URL" npm run prisma:seed )
  fi

  cat <<EOF

  TypeForge is up.
    Web:  http://localhost:4200
    API:  http://localhost:3000
    Docs: http://localhost:3000/api/docs

  Press Ctrl+C to stop the dev servers. Docker stays up — run ./run.sh down to stop it.

EOF
  npm run dev
}

cmd_down() {
  require docker
  log "Stopping docker services"
  docker compose down
}

cmd_seed() {
  require docker
  require node
  log "Re-running Prisma seed (wipes challenges)"
  ( cd apps/api && DATABASE_URL="$DB_URL" npm run prisma:seed )
}

case "${1:-up}" in
  up)    cmd_up ;;
  down)  cmd_down ;;
  seed)  cmd_seed ;;
  *)     die "Usage: ./run.sh [up|down|seed]" ;;
esac
