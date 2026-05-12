const https = require('https');
const fs = require('fs');

const rknSources = [
    'https://raw.githubusercontent.com/zapret-info/z-i/master/dump.csv',
    'https://reestr.rublacklist.net/api/v2/domains/json/'
];

function downloadWhitelist(url, callback) {
    const filePath = `/tmp/whitelist_${Math.random().toString(36).substring(7)}.txt`;
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close(() => callback(null, filePath));
        });
    }).on('error', (err) => {
        fs.unlink(filePath);
        callback(err.message);
    });
}

rknSources.forEach((source, index) => {
    downloadWhitelist(source, (err, path) => {
        if (err) {
            console.error(`Failed to download from source ${index}:`, err);
        } else {
            console.log(`Downloaded whitelist from source ${index} to ${path}`);
            
            // Process domains list
            const data = fs.readFileSync(path, 'utf8');
            let domains = [];
            
            if (source.includes('rublacklist')) {
                domains = JSON.parse(data);
            } else {
                // Parse CSV dump
                const lines = data.split('\n');
                lines.forEach(line => {
                    const parts = line.split(';');
                    if (parts.length > 1) {
                        const domainPart = parts[1].trim();
                        if (domainPart && !domainPart.startsWith('"')) {
                            domains.push(domainPart);
                        }
                    }
                });
            }
            
            // Save processed domains
            const outputPath = `/etc/proxy/whitelists/domains_${index}.txt`;
            fs.mkdirSync('/etc/proxy/whitelists', { recursive: true });
            fs.writeFileSync(outputPath, domains.join('\n'));
            console.log(`Saved ${domains.length} domains to ${outputPath}`);
        }
    });
});
