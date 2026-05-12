FROM alpine:latest

# Установка необходимых пакетов
RUN apk add --no-cache \
    curl \
    wget \
    nodejs \
    npm \
    supervisor \
    openssl

# Установка Xray
RUN wget -O /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/xray

# Установка Hysteria2
RUN wget -O /usr/local/bin/hysteria https://github.com/apernet/hysteria/releases/latest/download/hysteria-linux-amd64 \
    && chmod +x /usr/local/bin/hysteria

# Создание директорий
RUN mkdir -p /etc/proxy/config /etc/proxy/blocklists /etc/proxy/local-domains /var/log /etc/letsencrypt

# Копирование файлов
COPY entrypoint.sh /entrypoint.sh
COPY config/ /etc/proxy/config/
COPY scripts/ /scripts/

# Установка прав
RUN chmod +x /entrypoint.sh
RUN chmod +x /scripts/*.js

# Открытие портов
EXPOSE 443/tcp 80/tcp 50000/udp

# Команда запуска
CMD ["/entrypoint.sh"]
