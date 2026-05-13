const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8080;
const RAILWAY_DOMAIN = 'zephyrox-vpn-free-production.up.railway.app';
const UUID = process.env.USER_UUID || '1968654d-0cf6-4c17-b6c5-40e19b06ee60';
const HYSTERIA_PASSWORD = process.env.HYSTERIA_PASSWORD || 'SolusMC_250020082Proxy';
const SHORT_ID = process.env.SHORT_ID || '6fa175bed0382c49';

// Генерация подписки для sing-box
const generateSubscription = () => {
    const vlessConfig = {
        remarks: "🛸 Zephyrox VLESS",
        server: RAILWAY_DOMAIN,
        server_port: 443,
        uuid: UUID,
        flow: "xtls-rprx-vision",
        encryption: "none",
        type: "vless"
    };
    
    const hysteriaConfig = {
        remarks: "🚀 Zephyrox Hysteria2",
        server: RAILWAY_DOMAIN,
        server_port: 50000,
        password: HYSTERIA_PASSWORD,
        type: "hysteria2"
    };
    
    return [vlessConfig, hysteriaConfig];
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    // API endpoint
    if (path === '/api/status') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'operational',
            version: '2.0.0',
            protocols: ['vless', 'hysteria2'],
            uptime: process.uptime()
        }));
        return;
    }
    
    // Subscription endpoint
    if (path === '/sub') {
        const configs = generateSubscription();
        const jsonStr = JSON.stringify(configs);
        const base64Config = Buffer.from(jsonStr).toString('base64');
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Profile-Update-Interval', '6');
        res.end(base64Config);
        return;
    }
    
    // Main page with cosmic design
    if (path === '/' || path === '/index.html') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛸 Zephyrox VPN | Cosmic Shield</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }
        
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
                radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: stars 50s linear infinite;
            z-index: -1;
        }
        
        @keyframes stars {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            text-align: center;
            padding: 40px 0;
            position: relative;
        }
        
        .logo {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
        
        .subtitle {
            font-size: 1.2rem;
            color: #aaa;
            margin-bottom: 30px;
        }
        
        .status-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .status-item {
            background: rgba(0, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .status-item:hover {
            transform: translateY(-5px);
            background: rgba(0, 255, 255, 0.2);
        }
        
        .status-item h3 {
            color: #00ffff;
            margin-bottom: 10px;
        }
        
        .configs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 40px 0;
        }
        
        .config-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .config-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
