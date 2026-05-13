#!/bin/bash
set -e

echo "🚀 Initializing Zephyrox Multiverse VPN..."

# Set timezone
ln -sf /usr/share/zoneinfo/UTC /etc/localtime

# Generate SSL certificates if needed
if [ ! -f "/etc/ssl/private/cert.pem" ]; then
    echo "🔐 Generating SSL certificates..."
    mkdir -p /etc/ssl/private
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/privkey.pem \
        -out /etc/ssl/private/cert.pem \
        -subj "/CN=zephyrox-vpn-multiverse/O=Zephyrox VPN/C=US"
fi

# Generate configurations
echo "⚙️ Generating multi-protocol configurations..."
node /app/scripts/generate-configs.js

# Setup network rules
echo "🛡️ Setting up network security..."
iptables -I INPUT -p tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG NONE -j DROP
iptables -I INPUT -p tcp --tcp-flags FIN,SYN FIN,SYN -j DROP
iptables -I INPUT -p tcp --tcp-flags SYN,RST SYN,RST -j DROP

# Create supervisord configuration
cat > /etc/supervisord.conf <<EOF
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisord.log
pidfile=/var/run/supervisord.pid

[program:xray-main]
command=/usr/local/bin/xray run -c /app/config/xray-main.json
directory=/app
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/xray-main.log

[program:xray-backup]
command=/usr/local/bin/xray run -c /app/config/xray-backup.json
directory=/app
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/xray-backup.log

[program:hysteria2]
command=/usr/local/bin/hysteria server -c /app/config/hysteria2.yaml
directory=/app
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/hysteria2.log

[program:subscription-api]
command=node /app/scripts/subscription-api.js
directory=/app
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/subscription-api.log

[program:health-monitor]
command=node /app/scripts/health-monitor.js
directory=/app
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/health-monitor.log
EOF

echo "🎯 Launching Zephyrox Multiverse VPN services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
