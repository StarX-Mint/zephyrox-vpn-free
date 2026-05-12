const https = require('https');
const fs = require('fs');
const path = require('path');

const blockedDomainsSources = [
    'https://raw.githubusercontent.com/zapret-info/z-i/master/dump.csv',
    'https://reestr.rublacklist.net/api/v2/domains/json/',
    'https://raw.githubusercontent.com/anticensority/russian-domains-blacklist/main/dnszones.txt'
];

function downloadBlockedDomains(url, callback) {
    const filePath = `/tmp/blocked_${Math.random().toString(36).substring(7)}.txt`;
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

function processRussianServices() {
    const russianServices = [
        "vk.com", "ok.ru", "mail.ru", "yandex.ru", "ya.ru", "rambler.ru",
        "avito.ru", "ozon.ru", "wildberries.ru", "aliexpress.ru",
        "sberbank.ru", "alfabank.ru", "vtb.ru", "gazprombank.ru",
        "rosbank.ru", "tinkoff.ru", "raiffeisen.ru", "homecredit.ru",
        "skbkontur.ru", "kazanexpress.ru", "leroymerlin.ru", "dns-shop.ru"
    ];
    
    const localDomainsPath = '/etc/proxy/local-domains.txt';
    fs.mkdirSync(path.dirname(localDomainsPath), { recursive: true });
    fs.writeFileSync(localDomainsPath, russianServices.join('\n'));
    console.log(`Saved ${russianServices.length} Russian services to exclude from VPN`);
}

blockedDomainsSources.forEach((source, index) => {
    downloadBlockedDomains(source, (err, path) => {
        if (err) {
            console.error(`Failed to download from source ${index}:`, err);
        } else {
            console.log(`Downloaded blocklist from source ${index} to ${path}`);
            
            // Process domains list
            const data = fs.readFileSync(path, 'utf8');
            let domains = [];
            
            if (source.includes('rublacklist')) {
                domains = JSON.parse(data);
            } else if (source.includes('dnszones')) {
                const lines = data.split('\n');
                lines.forEach(line => {
                    if (line.startsWith('zone "')) {
                        const domain = line.substring(6, line.indexOf('"', 6));
                        if (domain && !domain.endsWith('.ru') && !domain.endsWith('.su')) {
                            domains.push(domain);
                        }
                    }
                });
            } else {
                // Parse CSV dump
                const lines = data.split('\n');
                lines.forEach(line => {
                    const parts = line.split(';');
                    if (parts.length > 1) {
                        const domainPart = parts[1].trim();
                        if (domainPart && !domainPart.startsWith('"') && !domainPart.match(/\.(ru|su)$/)) {
                            domains.push(domainPart);
                        }
                    }
                });
            }
            
            // Save processed domains
            const outputPath = `/etc/proxy/blocklists/domains_${index}.txt`;
            fs.mkdirSync('/etc/proxy/blocklists', { recursive: true });
            fs.writeFileSync(outputPath, domains.join('\n'));
            console.log(`Saved ${domains.length} blocked domains to ${outputPath}`);
        }
    });
});

processRussianServices();
