#!/bin/sh

# АВТОФИКС CRLF (работает БЕЗ build command!)
tr -d '\r' < /entrypoint.sh > /tmp/fixed.sh && chmod +x /tmp/fixed.sh && exec /tmp/fixed.sh "$@"

HOSTNAME=zephyrox-vpn-free-production.up.railway.app
UUID=1968654d-0cf6-4c17-b6c5-40e19b06ee60

echo "🚀 Zephyrox VPN FIXED starting..."

mkdir -p /etc/proxy/config /etc/letsencrypt/live/vpn

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/letsencrypt/live/vpn/privkey.pem -out /etc/letsencrypt/live/vpn/cert.pem -subj "/CN=$HOSTNAME" -batch

cat > /etc/proxy/config/xray.json << 'END'
{
  "log": {"loglevel": "none"},
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
        "serverNames": ["zephyrox-vpn-free-production.up.railway.app","www.google.com"]
      }
    }
  }],
  "outbounds": [{"protocol": "freedom"}]
}
END

cat > /etc/proxy/config/hysteria2.yaml << 'END'
listen: :50000
acme:
  domains: ["zephyrox-vpn-free-production.up.railway.app"]
  email: admin@zephyrox-vpn-free-production.up.railway.app
auth:
  type: password
  password: 1968654d-0cf6-4c17-b6c5-40e19b06ee60
masquerade:
  type: proxy
  proxy:
    url: https://www.google.com
    rewriteHost: true
END

echo "🎉 Starting Xray + Hysteria2..."

/usr/local/bin/xray run -c /etc/proxy/config/xray.json &
/usr/local/bin/hysteria server -c /etc/proxy/config/hysteria2.yaml &

echo "✅ VPN LIVE!"
echo "vless://1968654d-0cf6-4c17-b6c5-40e19b06ee60@zephyrox-vpn-free-production.up.railway.app:443?type=ws&path=%2Fvless&host=zephyrox-vpn-free-production.up.railway.app&encryption=none&security=reality&sni=zephyrox-vpn-free-production.up.railway.app#Zephyrox"

wait