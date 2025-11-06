import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to send code to the server and get Mermaid output
async function convertToMermaid(code, language) {
  try {
    const response = await fetch('http://localhost:3400/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error(`Error converting ${language}:`, error.message);
      return null;
    }
    
    const result = await response.json();
    return result.mermaid;
  } catch (error) {
    console.error(`Error converting ${language}:`, error.message);
    return null;
  }
}

// Test our conditional chain
async function testConditional() {
  console.log('Testing conversion of conditional chain...\n');
  
  // JavaScript conditional program
  const jsCode = fs.readFileSync(path.join(__dirname, 'tests', 'js', 'if else if statements', 'test.js'), 'utf8');
  console.log('JavaScript Conditional Program:');
  console.log(jsCode);
  
  const jsMermaid = await convertToMermaid(jsCode, 'js');
  if (jsMermaid) {
    console.log('JavaScript Conditional Mermaid Output:');
    console.log(jsMermaid);
  }
}

// Run the test
testConditional().catch(console.error);