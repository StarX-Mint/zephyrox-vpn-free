#!/bin/sh
set -e

echo "Starting Zephyrox VPN service..."

# Создание самоподписанных сертификатов если они отсутствуют
if [ ! -f "/etc/letsencrypt/live/zephyrox-vpn/cert.pem" ]; then
    echo "Generating self-signed certificates..."
    mkdir -p /etc/letsencrypt/live/zephyrox-vpn
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/letsencrypt/live/zephyrox-vpn/privkey.pem \
        -out /etc/letsencrypt/live/zephyrox-vpn/cert.pem \
        -subj "/CN=zephyrox-vpn.local"
fi

# Экспорт переменных
export SERVICE_DISPLAY_NAME="Zephyrox VPN"

# Генерация конфигов
echo "Generating configuration files..."
node /scripts/generate-config.js

# Создание конфига supervisord
cat > /etc/supervisord.conf <<EOF
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisord.log
pidfile=/var/run/supervisord.pid

[program:xray]
command=/usr/local/bin/xray run -c /etc/proxy/config/xray.json
directory=/etc/proxy
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/xray.log

[program:hysteria2]
command=/usr/local/bin/hysteria server -c /etc/proxy/config/hysteria2.yaml
directory=/etc/proxy
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/hysteria2.log

[program:healthcheck]
command=node /scripts/health-check.js
directory=/scripts
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/healthcheck.log
EOF

# Запуск supervisord
echo "Starting services with supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
