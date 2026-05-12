const fs = require('fs');
const crypto = require('crypto');

// Generate UUID if not exists
let uuid = process.env.USER_UUID;
if (!uuid) {
    uuid = crypto.randomUUID();
    console.log(`Generated new UUID: ${uuid}`);
}

// Generate XRay config
let xrayConfig = fs.readFileSync('/etc/proxy/config/xray.json', 'utf8');
xrayConfig = xrayConfig.replace('$UUID', uuid);
// In real deployment, replace these with actual values from env vars
xrayConfig = xrayConfig.replace('$PRIVATE_KEY', process.env.XRAY_PRIVATE_KEY || 'private_key_here');
xrayConfig = xrayConfig.replace('$SHORT_ID', process.env.SHORT_ID || 'short_id_here');
fs.writeFileSync('/etc/proxy/config/xray.json', xrayConfig);

// Generate Hysteria config
let hysteriaConfig = fs.readFileSync('/etc/proxy/config/hysteria2.yaml', 'utf8');
hysteriaConfig = hysteriaConfig.replace('$HYSTERIA_PASSWORD', process.env.HYSTERIA_PASSWORD || 'default_password');
hysteriaConfig = hysteriaConfig.replace('$TLS_CERT_PATH', process.env.TLS_CERT_PATH || '/certs/fullchain.pem');
hysteriaConfig = hysteriaConfig.replace('$TLS_KEY_PATH', process.env.TLS_KEY_PATH || '/certs/privkey.pem');
fs.writeFileSync('/etc/proxy/config/hysteria2.yaml', hysteriaConfig);

console.log("Configs generated successfully");
