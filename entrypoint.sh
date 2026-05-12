#!/bin/sh
set -e

HOSTNAME=${HOSTNAME:-"zephyrox-vpn-free-production.up.railway.app"}
UUID="1968654d-0cf6-4c17-b6c5-40e19b06ee60"

echo "🚀 Zephyrox VPN v2.0 starting..."

# Создаём директории
mkdir -p /etc/proxy/config /etc/letsencrypt/live/vpn /var/log

# SSL (упрощённо)
if [ ! -f "/etc/letsencrypt/live/vpn/cert.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/letsencrypt/live/vpn/privkey.pem \
        -out /etc/letsencrypt/live/vpn/cert.pem \
        -subj "/CN=${HOSTNAME}"
fi

# XRAY config (МИНИМАЛЬНЫЙ)
cat > /etc/proxy/config/xray.json <<'EOF'
{
  "log": {"loglevel": "warning"},
  "inbounds": [{
    "port": 443,
    "protocol": "vless",
    "settings": {
      "clients": [{"id": "1968654d-0cf6-4c17-b6c5-40e19b06ee60"}],
      "decryption": "none"
    },
    "streamSettings": {
      "network": "ws",
      "wsSettings": {"path": "/vless"},
      "security": "reality",
      "realitySettings": {
        "dest": "www.google.com:443",
        "serverNames": ["zephyrox-vpn-free-production.up.railway.app", "www.google.com"]
      }
    }
  }],
  "outbounds": [{"protocol": "freedom"}]
}
EOF

# Hysteria2 config
cat > /etc/proxy/config/hysteria2.yaml <<EOF
listen: :50000
acme:
  domains: [${HOSTNAME}]
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

echo "✅ Configs ready. Starting services..."

# Запуск в фоне
/usr/local/bin/xray run -c /etc/proxy/config/xray.json &
/usr/local/bin/hysteria server -c /etc/proxy/config/hysteria2.yaml &

echo "🎉 VPN ready on 443 (VLESS) + 50000 (Hysteria2)"
wait