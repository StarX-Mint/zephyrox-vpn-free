#!/bin/sh

HOSTNAME=${HOSTNAME:-"zephyrox-vpn-free-production.up.railway.app"}
UUID="1968654d-0cf6-4c17-b6c5-40e19b06ee60"

echo "🚀 Zephyrox VPN starting on ${HOSTNAME}..."

# SSL сертификаты
if [ ! -f "/etc/letsencrypt/live/vpn/cert.pem" ]; then
    echo "📄 Generating SSL..."
    mkdir -p /etc/letsencrypt/live/vpn
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/letsencrypt/live/vpn/privkey.pem \
        -out /etc/letsencrypt/live/vpn/cert.pem \
        -subj "/CN=${HOSTNAME}"
fi

# Генерация реальных конфигов
cat > /etc/proxy/config/xray.json <<EOF
{
  "inbounds": [{
    "port": 443,
    "protocol": "vless",
    "settings": {
      "clients": [{"id": "${UUID}"}],
      "decryption": "none"
    },
    "streamSettings": {
      "network": "ws",
      "wsSettings": {"path": "/vless"},
      "security": "reality",
      "realitySettings": {
        "show": false,
        "dest": "www.google.com:443",
        "xver": 0,
        "serverNames": ["${HOSTNAME}", "www.google.com"]
      }
    }
  }],
  "outbounds": [{"protocol": "freedom"}]
}
EOF

cat > /etc/proxy/config/hysteria2.yaml <<EOF
listen: :50000

acme:
  domains:
    - ${HOSTNAME}
  email: admin@${HOSTNAME}

auth:
  type: password
  password: ${UUID}

masquerade:
  type: proxy
  proxy:
    url: https://www.google.com
    rewriteHost: true
EOF

# Запуск subscription сервера
echo "🌐 Starting subscription API..."
node /scripts/subscription.js &

# Supervisor
cat > /etc/supervisord.conf <<EOF
[supervisord]
nodaemon=true
logfile=/var/log/supervisord.log

[program:xray]
command=/usr/local/bin/xray run -c /etc/proxy/config/xray.json
autostart=true
autorestart=true
stdout_logfile=/var/log/xray.log

[program:hysteria2]
command=/usr/local/bin/hysteria server -c /etc/proxy/config/hysteria2.yaml
autostart=true
autorestart=true
stdout_logfile=/var/log/hysteria2.log
EOF

echo "✅ Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf