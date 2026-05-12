FROM alpine:latest

# Установка пакетов + unzip для Xray
RUN apk add --no-cache \
    curl \
    wget \
    nodejs \
    npm \
    supervisor \
    openssl \
    unzip \
    && mkdir -p /etc/supervisor/conf.d \
    && mkdir -p /etc/proxy/config /etc/proxy/blocklists /etc/proxy/local-domains /var/log /etc/letsencrypt

# Xray-core
RUN wget -O /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/xray \
    && rm /tmp/xray.zip

# Hysteria2
RUN wget -O /usr/local/bin/hysteria https://github.com/apernet/hysteria/releases/latest/download/hysteria-linux-amd64 \
    && chmod +x /usr/local/bin/hysteria

# Копирование файлов
COPY entrypoint.sh /entrypoint.sh
COPY config/ /etc/proxy/config/
COPY scripts/ /scripts/

# Права доступа
RUN chmod +x /entrypoint.sh /scripts/*.js \
    && chmod -R 755 /etc/proxy /scripts

# Порты
EXPOSE 80 443 50000/udp

# ✅ КЛЮЧЕВОЙ ФИКС
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]