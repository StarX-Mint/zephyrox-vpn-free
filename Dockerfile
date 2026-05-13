FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache \
    curl \
    wget \
    nodejs \
    npm \
    supervisor \
    openssl \
    iptables \
    ca-certificates \
    tzdata

# Create necessary directories
RUN mkdir -p /app /app/scripts /app/config /var/log/zephyrox /etc/ssl/private

# Install Xray
RUN wget -O /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/xray

# Install Hysteria2
RUN wget -O /usr/local/bin/hysteria https://github.com/apernet/hysteria/releases/latest/download/hysteria_linux_amd64 \
    && chmod +x /usr/local/bin/hysteria

# Install GeoIP databases
RUN wget -O /app/geoip.dat https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat \
    && wget -O /app/geosite.dat https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat

# Copy application files
COPY scripts/ /app/scripts/
COPY config/ /app/config/
COPY entrypoint.sh /app/entrypoint.sh

# Set permissions
RUN chmod +x /app/entrypoint.sh \
    && chmod +x /app/scripts/*.js \
    && chown -R root:root /app

WORKDIR /app

EXPOSE 80/tcp 443/tcp 50000/udp 2083/tcp 2053/tcp 8443/tcp 10000/udp

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["/app/entrypoint.sh"]
