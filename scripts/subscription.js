const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 80;
const HOSTNAME = process.env.HOSTNAME || 'zephyrox-vpn-free-production.up.railway.app';
const UUID = '1968654d-0cf6-4c17-b6c5-40e19b06ee60';

// ✅ РЕАЛЬНЫЕ конфиги для Happ
const VMESS_LINK = `vmess://ewogICJ2IjogIjIiLAogICJwc iI6ICJSYWlsd2F5LVplcGh5cm94IiwKICAiYWRkIjogIiIsCiAgInBvcnQiOiAiNDQzIiwKICAiaWQiOiAi${UUID}IiwKICAiYWlkIjogIjAiLAogICJzY3kiOiAidGxzIiwKICAibmV0IjogIndzIiwKICAidHlwZSI6ICJub25lIiwKICAicGF0aCI6ICIvdm1lc3MiLAogICJob3N0IjogIiIsCiAgInRscyI6ICJyZWFsaXR5IiwKICAic25pIjogIiIKfQ==`;

const HYSTERIA2_LINK = `hysteria2://${UUID}@${HOSTNAME}:50000/?sni=${HOSTNAME}&insecure=1#Zephyrox-Hysteria2`;

const server = http.createServer((req, res) => {
  const url = req.url;
  
  // 📱 Happ Subscription
  if (url === '/sub') {
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${VMESS_LINK}\n${HYSTERIA2_LINK}`);
    return;
  }
  
  // 📋 JSON API
  if (url === '/api/configs') {
    res.json({
      vmess: VMESS_LINK,
      hysteria2: HYSTERIA2_LINK,
      subscription: `https://${HOSTNAME}/sub`,
      uuid: UUID,
      hostname: HOSTNAME
    });
    return;
  }
  
  // 🌐 Главная страница
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Zephyrox VPN</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style>body{font-family:system-ui;max-width:500px;margin:50px auto;padding:20px;background:#0a0a1a;color:white;}
    .card{background:#1a1a2e;padding:30px;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.5);}
    h1{color:#00d4ff;text-align:center;font-size:2em;}
    .config{background:#16213e;padding:20px;border-radius:10px;margin:15px 0;word-break:break-all;}
    button{background:#00d4ff;color:black;border:none;padding:15px 30px;border-radius:25px;cursor:pointer;font-weight:bold;}
    textarea{width:100%;height:80px;padding:10px;background:#0f1620;color:white;border:1px solid #333;border-radius:10px;}
    @media(max-width:600px){body{margin:20px;}}</style>
</head>
<body>
<div class="card">
    <h1>🚀 Zephyrox VPN</h1>
    <p><strong>Статус:</strong> ✅ Работает</p>
    
    <h3>📱 Happ / HiddifyNext:</h3>
    <div class="config">
        <strong>Subscription:</strong><br>
        <textarea id="sub" readonly>https://${HOSTNAME}/sub</textarea>
        <br><button onclick="copy('sub')">📋 Копировать</button>
    </div>
    
    <h3>⚡ Hysteria2 (быстрый):</h3>
    <div class="config">
        <textarea id="hysteria" readonly>${HYSTERIA2_LINK}</textarea>
        <br><button onclick="copy('hysteria')">📋 Копировать</button>
    </div>
    
    <h3>🔗 VMess:</h3>
    <div class="config">
        <textarea id="vmess" readonly>${VMESS_LINK}</textarea>
        <br><button onclick="copy('vmess')">📋 Копировать</button>
    </div>
    
    <p style="text-align:center;font-size:14px;color:#aaa;">
        TCP 443 | UDP 50000 | IPv4+IPv6
    </p>
</div>
<script>
function copy(id){
    navigator.clipboard.writeText(document.getElementById(id).value);
    alert('✅ Скопировано в буфер!');
}
</script>
</body>
</html>`);
    return;
  }
  
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`🌐 Zephyrox API on ${HOSTNAME}:${PORT}`);
});