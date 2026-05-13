const fs = require('fs');
const path = require('path');

console.log("🔧 Generating Zephyrox Multiverse configurations...");

const env = {
    USER_UUID: process.env.USER_UUID || '1968654d-0cf6-4c17-b6c5-40e19b06ee60',
    XRAY_PRIVATE_KEY: process.env.XRAY_PRIVATE_KEY || 'KAs6zgln0PGSNCAgwfvhxR6cwBkXjbaAM2Nqjd640HI',
    SHORT_ID: process.env.SHORT_ID || '6fa175bed0382c49',
    HYSTERIA_PASSWORD: process.env.HYSTERIA_PASSWORD || 'SolusMC_250020082Proxy'
};

// Generate main Xray config
try {
    let config = fs.readFileSync('/app/config/xray-main.json', 'utf8');
    config = config.replace(/\$USER_UUID/g, env.USER_UUID);
    config = config.replace(/\$XRAY_PRIVATE_KEY/g, env.XRAY_PRIVATE_KEY);
    config = config.replace(/\$SHORT_ID/g, env.SHORT_ID);
    fs.writeFileSync('/app/config/xray-main.json', config);
    console.log("✅ Xray main config generated");
} catch (err) {
    console.error("❌ Failed to generate Xray main config:", err.message);
}

// Generate backup Xray config
try {
    let config = fs.readFileSync('/app/config/xray-backup.json', 'utf8');
    config = config.replace(/\$USER_UUID/g, env.USER_UUID);
    fs.writeFileSync('/app/config/xray-backup.json', config);
    console.log("✅ Xray backup config generated");
} catch (err) {
    console.error("❌ Failed to generate Xray backup config:", err.message);
}

// Generate Hysteria config
try {
    let config = fs.readFileSync('/app/config/hysteria2.yaml', 'utf8');
    config = config.replace(/\$HYSTERIA_PASSWORD/g, env.HYSTERIA_PASSWORD);
    fs.writeFileSync('/app/config/hysteria2.yaml', config);
    console.log("✅ Hysteria config generated");
} catch (err) {
    console.error("❌ Failed to generate Hysteria config:", err.message);
}

console.log("🎉 All configurations generated successfully");
