const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
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
            config: `vless://${USER_UUID}@${HOSTNAME}:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=www.cloudflare.com&fp=chrome&sid=${SHORT_ID}#Zephyrox-VLESS`
        },
        {
            id: "vmess-ws",
            name: "⚡ Zephyrox VMess WebSocket",
            type: "vmess",
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
            })).toString('base64')}#Zephyrox-VMess`
        },
        {
            id: "hysteria2",
            name: "🚀 Zephyrox Hysteria2",
            type: "hysteria2",
            config: `hysteria2://${HYSTERIA_PASSWORD}@${HOSTNAME}:50000?insecure=1&sni=${HOSTNAME}#Zephyrox-Hysteria2`
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
    
    // Subscription endpoint
    if (path === '/sub') {
        const profiles = generateAllProfiles();
        const configs = profiles.map(p => p.config).join('\n');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Profile-Update-Interval', '6');
        res.end(configs);
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
    <style>
        body { font-family: system-ui, sans-serif; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: white; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; padding: 40px 0; }
        h1 { font-size: 3rem; margin-bottom: 10px; background: linear-gradient(45deg, #00ffff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .profiles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; margin: 40px 0; }
        .profile-card { background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 25px; border: 1px solid rgba(0, 255, 255, 0.2); }
        .profile-name { font-size: 1.3rem; font-weight: bold; color: #00ffff; margin-bottom: 15px; }
        .config-box { background: #000; padding: 15px; border-radius: 10px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 0.9rem; }
        button { background: linear-gradient(45deg, #00ffff, #ff00ff); color: black; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🛸 Zephyrox Multiverse VPN</h1>
            <p>Мощный VPN с множеством протоколов</p>
        </header>
        
        <div class="profiles-grid">
            ${profiles.map(profile => `
                <div class="profile-card">
                    <div class="profile-name">${profile.name}</div>
                    <div class="config-box">
                        <textarea id="${profile.id}" readonly style="width:100%;background:transparent;color:white;border:none;height:80px;">${profile.config}</textarea>
                    </div>
                    <button onclick="copyConfig('${profile.id}')">📋 Копировать</button>
                </div>
            `).join('')}
        </div>
        
        <div style="text-align:center;margin:40px 0;">
            <h3>📱 Subscription URL:</h3>
            <div class="config-box">
                <textarea id="subscription" readonly style="width:100%;background:transparent;color:white;border:none;height:40px;">https://${HOSTNAME}:${PORT}/sub</textarea>
                <br><button onclick="copyConfig('subscription')">📋 Копировать</button>
            </div>
        </div>
    </div>
    
    <script>
        function copyConfig(elementId) {
            const element = document.getElementById(elementId);
            element.select();
            navigator.clipboard.writeText(element.value);
            alert('✅ Скопировано!');
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
});
