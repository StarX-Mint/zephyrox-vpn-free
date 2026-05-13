const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.HOSTNAME || 'zephyrox-vpn-free-production.up.railway.app';
const USER_UUID = process.env.USER_UUID || '1968654d-0cf6-4c17-b6c5-40e19b06ee60';
const HYSTERIA_PASSWORD = process.env.HYSTERIA_PASSWORD || 'SolusMC_250020082Proxy';
const SHORT_ID = process.env.SHORT_ID || '6fa175bed0382c49';

// Generate all profiles
const generateAllProfiles = () => {
    const profiles = [
        {
            id: "vless-reality",
            name: "🛸 Zephyrox VLESS Reality",
            type: "vless",
            server: HOSTNAME,
            port: 443,
            config: `vless://${USER_UUID}@${HOSTNAME}:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=www.cloudflare.com&fp=chrome&sid=${SHORT_ID}#Zephyrox-VLESS`
        },
        {
            id: "vmess-ws",
            name: "⚡ Zephyrox VMess WebSocket",
            type: "vmess",
            server: HOSTNAME,
            port: 8080,
            config: `vmess://${Buffer.from(JSON.stringify({
                v: "2",
                ps: "Zephyrox-VMess",
                add: HOSTNAME,
                port: "8080",
                id: USER_UUID,
                aid: "0",
                net: "ws",
                path: "/vmess-ws",
                type: "none",
                host: "",
                tls: ""
            })).toString('base64')}`
        },
        {
            id: "trojan-tls",
            name: "🔒 Zephyrox Trojan TLS",
            type: "trojan",
            server: HOSTNAME,
            port: 2083,
            config: `trojan://${USER_UUID}@${HOSTNAME}:2083?security=tls&type=tcp#Zephyrox-Trojan`
        },
        {
            id: "hysteria2",
            name: "🚀 Zephyrox Hysteria2",
            type: "hysteria2",
            server: HOSTNAME,
            port: 50000,
            config: `hysteria2://${HYSTERIA_PASSWORD}@${HOSTNAME}:50000?insecure=1&sni=${HOSTNAME}#Zephyrox-Hysteria2`
        },
        {
            id: "shadowsocks",
            name: "👻 Zephyrox Shadowsocks",
            type: "ss",
            server: HOSTNAME,
            port: 10000,
            config: `ss://YWVzLTI1Ni1nY206${Buffer.from(USER_UUID).toString('base64')}@${HOSTNAME}:10000#Zephyrox-Shadowsocks`
        }
    ];
    
    return profiles;
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    // Health check
    if (path === '/health') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'Zephyrox Multiverse VPN',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // API status
    if (path === '/api/status') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'operational',
            version: '3.0.0',
            protocols: ['vless', 'vmess', 'trojan', 'hysteria2', 'shadowsocks'],
            hostname: HOSTNAME,
            uptime: Math.floor(process.uptime())
        }));
        return;
    }
    
    // Subscription endpoint
    if (path === '/sub') {
        const profiles = generateAllProfiles();
        const configs = profiles.map(p => p.config).join('\n');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Profile-Update-Interval', '6');
        res.setHeader('Subscription-Userinfo', 'upload=0; download=0; total=1073741824000; expire=0');
        res.end(configs);
        return;
    }
    
    // JSON API for profiles
    if (path === '/api/profiles') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(generateAllProfiles()));
        return;
    }
    
    // Individual profile
    if (path.startsWith('/profile/')) {
        const profileId = path.split('/')[2];
        const profiles = generateAllProfiles();
        const profile = profiles.find(p => p.id === profileId);
        
        if (profile) {
            res.setHeader('Content-Type', 'text/plain');
            res.end(profile.config);
        } else {
            res.statusCode = 404;
            res.end('Profile not found');
        }
        return;
    }
    
    // Main dashboard
    if (path === '/' || path === '/dashboard') {
        const profiles = generateAllProfiles();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>🛸 Zephyrox Multiverse VPN</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: system-ui, sans-serif; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: white; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 3rem; margin-bottom: 10px; background: linear-gradient(45deg, #00ffff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .status { background: rgba(0, 255, 255, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center; }
        .profiles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; margin: 40px 0; }
        .profile-card { background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 25px; border: 1px solid rgba(0, 255, 255, 0.2); transition: all 0.3s ease; }
        .profile-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); background: rgba(0, 255, 255, 0.1); }
        .profile-name { font-size: 1.3rem; font-weight: bold; color: #00ffff; margin-bottom: 15px; }
        .profile-details { margin: 15px 0; }
        .config-box { background: #000; padding: 15px; border-radius: 10px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 0.9rem; }
        button { background: linear-gradient(45deg, #00ffff, #ff00ff); color: black; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold; margin: 10px 5px; }
        button:hover { transform: scale(1.05); }
        footer { text-align: center; margin-top: 50px; color: #aaa; font-size: 0.9rem; }
        @media (max-width: 768px) { .profiles-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🛸 Zephyrox Multiverse VPN</h1>
            <p>Мощный VPN с множеством протоколов для обхода ограничений</p>
        </header>
        
        <div class="status">
            <h2>✅ Сервис работает</h2>
            <p>Все системы в норме • ${profiles.length} протоколов доступно</p>
        </div>
        
        <div class="profiles-grid">
            ${profiles.map(profile => `
                <div class="profile-card">
                    <div class="profile-name">${profile.name}</div>
                    <div class="profile-details">
                        <strong>Сервер:</strong> ${profile.server}<br>
                        <strong>Порт:</strong> ${profile.port}<br>
                        <strong>Протокол:</strong> ${profile.type.toUpperCase()}
                    </div>
                    <div class="config-box">
                        <textarea id="${profile.id}" readonly style="width:100%;background:transparent;color:white;border:none;height:80px;">${profile.config}</textarea>
                    </div>
                    <button onclick="copyConfig('${profile.id}')">📋 Копировать</button>
                    <button onclick="downloadConfig('${profile.id}', '${profile.type}')">💾 Скачать</button>
                </div>
            `).join('')}
        </div>
        
        <div style="text-align:center;margin:40px 0;">
            <h3>📱 Для использования в приложениях:</h3>
            <div class="config-box">
                <p><strong>Subscription URL:</strong></p>
                <textarea id="subscription" readonly style="width:100%;background:transparent;color:white;border:none;height:40px;">https://${HOSTNAME}/sub</textarea>
                <br><button onclick="copyConfig('subscription')">📋 Копировать Subscription</button>
            </div>
        </div>
    </div>
    
    <footer>
        <p>Zephyrox Multiverse VPN • Все протоколы в одном месте</p>
    </footer>
    
    <script>
        function copyConfig(elementId) {
            const element = document.getElementById(elementId);
            element.select();
            navigator.clipboard.writeText(element.value);
            alert('✅ Скопировано в буфер обмена!');
        }
        
        function downloadConfig(elementId, type) {
            const element = document.getElementById(elementId);
            const blob = new Blob([element.value], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`zephyrox-\${type}.txt\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
        `);
        return;
    }
    
    res.statusCode = 404;
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`🚀 Zephyrox Multiverse VPN API running on port ${PORT}`);
    console.log(`🌍 Dashboard: http://localhost:${PORT}`);
    console.log(`📡 Subscription: http://localhost:${PORT}/sub`);
});
