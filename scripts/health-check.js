const http = require('http');

// Простой HTTP сервер для проверки состояния
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'Zephyrox VPN',
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<html><body><h1>Zephyrox VPN Service Running</h1></body></html>');
    }
});

server.listen(80, () => {
    console.log('Health check server running on port 80');
});

// Держим процесс живым
setInterval(() => {
    console.log('Health check service alive:', new Date().toISOString());
}, 30000);
