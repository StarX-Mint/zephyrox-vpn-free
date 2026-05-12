#!/bin/sh

echo "🚀 Zephyrox VPN deploying..."

HOSTNAME=${HOSTNAME:-"zephyrox-vpn-free-production.up.railway.app"}
UUID="1968654d-0cf6-4c17-b6c5-40e19b06ee60"

# Заменяем переменные в конфигах
sed -i "s|\$UUID|$UUID|g" /etc/proxy/config/xray.json
sed -i "s|\$HOSTNAME|$HOSTNAME|g" /etc/proxy/config/*.yaml

# SSL
mkdir -p /etc/letsencrypt/live/vpn /var/log
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/letsencrypt/live/vpn/privkey.pem \
    -out /etc/letsencrypt/live/vpn/cert.pem \
    -subj "/CN=$HOSTNAME"

# Тест конфигов
echo "✅ Testing configs..."
/usr/local/bin/xray run -test -c /etc/proxy/config/xray.json && echo "Xray OK" || echo "Xray FAIL"

# Subscription
cd /scripts && node subscription.js &

# Запуск VPN
echo "🎉 Starting VPN..."
/usr/local/bin/xray run -c /etc/proxy/config/xray.json &
/usr/local/bin/hysteria server -c /etc/proxy/config/hysteria2.yaml &

echo "✅ LIVE! Subscription: https://${HOSTNAME}/sub"
wait