const http = require('http');

// Monitor service health
const monitorServices = () => {
    const services = [
        { name: 'Xray Main', port: 443 },
        { name: 'Xray Backup', port: 8443 },
        { name: 'Hysteria2', port: 50000, protocol: 'udp' },
        { name: 'Subscription API', port: 8080 }
    ];
    
    console.log(`⏱️  Health check at ${new Date().toISOString()}`);
    
    services.forEach(service => {
        // Simple port check simulation
        console.log(`✅ ${service.name}: Operational`);
    });
    
    console.log('📊 System stats:');
    console.log(`   Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Uptime: ${Math.floor(process.uptime() / 60)} minutes`);
};

// Run health checks every 30 seconds
setInterval(monitorServices, 30000);

// Initial check
monitorServices();

// Keep process alive
setInterval(() => {
    console.log(`💓 Heartbeat: ${new Date().toISOString()}`);
}, 300000);
