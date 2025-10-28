// Test API directly
import http from 'http';

const jsCode = `
let x = 2;
switch (x) {
    case 1:
        console.log("One");
        break;
    case 2:
        console.log("Two");
        break;
    default:
        console.log("Other");
}
console.log("End of program");
`;

const data = JSON.stringify({
    code: jsCode,
    language: 'js'
});

const options = {
    hostname: 'localhost',
    port: 3400,
    path: '/convert',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let result = '';
    res.on('data', (chunk) => {
        result += chunk;
    });
    res.on('end', () => {
        console.log('JavaScript Switch Statement Mermaid Output:');
        console.log(result);
    });
});

req.on('error', (error) => {
    console.error('Error:', error.message);
});

req.write(data);
req.end();