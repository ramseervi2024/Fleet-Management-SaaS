const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5006,
    path: '/api/dashboard/public-stats',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const response = JSON.parse(data);
        console.log('Response:', response);
        if (res.statusCode === 200 && response.success && response.stats) {
            console.log('✅ Public stats endpoint is working correctly.');
            process.exit(0);
        } else {
            console.error('❌ Public stats endpoint failed verification.');
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
    process.exit(1);
});

req.end();
