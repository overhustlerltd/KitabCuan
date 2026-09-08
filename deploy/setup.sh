#!/usr/bin/env bash
# Provisioning KitabCuan di VM Ubuntu 22.04 (E2).
# Jalankan sebagai user biasa yang punya sudo:  bash deploy/setup.sh
set -euo pipefail

APP_DIR="$HOME/KitabCuan"
REPO="https://github.com/overhustlerltd/KitabCuan.git"

echo "==> 1/4 Install Node 20, git, nginx, pm2"
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo apt-get install -y git nginx
sudo npm i -g pm2

echo "==> 2/4 Clone / update repo"
if [ ! -d "$APP_DIR" ]; then git clone "$REPO" "$APP_DIR"; fi
cd "$APP_DIR"
git pull --ff-only || true

if [ ! -f "$APP_DIR/.env" ]; then
  echo "!! .env belum ada. Salin dari .env.example lalu isi nilainya:"
  echo "   cp .env.example .env && nano .env"
  echo "   (build butuh .env terisi) — hentikan dulu, isi .env, jalankan ulang."
  exit 1
fi

echo "==> 3/4 Install deps & build"
npm ci
npm run build

echo "==> 4/4 Jalankan dengan pm2 (auto-restart saat reboot)"
pm2 delete kitabcuan >/dev/null 2>&1 || true
pm2 start "npm start" --name kitabcuan
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true

echo ""
echo "✅ Selesai. App jalan di http://127.0.0.1:3000"
echo "   Lanjut: pasang deploy/nginx-kitabcuan.conf, Cloudflare DNS + Origin Cert."
