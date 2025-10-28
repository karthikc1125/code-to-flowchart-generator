// Test API with detailed logging
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
        break;
}
console.log("End of program");
`;

console.log('Sending code to server:');
console.log(jsCode);

const data = JSON.stringify({
    code: jsCode,
    language: 'js'
});

console.log('Sending data:');
console.log(data);

const options = {
    hostname: 'localhost',
    port: 3400,
    path: '/convert',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let result = '';
    res.on('data', (chunk) => {
        result += chunk;
    });
    res.on('end', () => {
        console.log('JavaScript Switch Statement Mermaid Output:');
        console.log(result);
        
        try {
            const parsed = JSON.parse(result);
            console.log('Parsed mermaid:');
            console.log(parsed.mermaid);
        } catch (e) {
            console.error('Error parsing result:', e.message);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error.message);
});

req.write(data);
req.end();