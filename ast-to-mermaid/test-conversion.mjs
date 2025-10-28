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

// Function to detect language
async function detectLanguage(code) {
  try {
    const response = await fetch('http://localhost:3400/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error detecting language:', error.message);
      return null;
    }
    
    const result = await response.json();
    return result.language;
  } catch (error) {
    console.error('Error detecting language:', error.message);
    return null;
  }
}

// Test all our Hello World programs
async function testConversions() {
  console.log('Testing conversion of Hello World programs...\n');
  
  // C program
  const cCode = fs.readFileSync(path.join(__dirname, 'tests', 'c', 'hello.c'), 'utf8');
  console.log('C Program:');
  console.log(cCode);
  const cLanguage = await detectLanguage(cCode);
  console.log('Detected language:', cLanguage);
  const cMermaid = await convertToMermaid(cCode, 'c');
  if (cMermaid) {
    console.log('C Mermaid Output:');
    console.log(cMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // C++ program
  const cppCode = fs.readFileSync(path.join(__dirname, 'tests', 'cpp', 'hello.cpp'), 'utf8');
  console.log('C++ Program:');
  console.log(cppCode);
  const cppLanguage = await detectLanguage(cppCode);
  console.log('Detected language:', cppLanguage);
  const cppMermaid = await convertToMermaid(cppCode, 'cpp');
  if (cppMermaid) {
    console.log('C++ Mermaid Output:');
    console.log(cppMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Java program
  const javaCode = fs.readFileSync(path.join(__dirname, 'tests', 'java', 'Hello.java'), 'utf8');
  console.log('Java Program:');
  console.log(javaCode);
  const javaLanguage = await detectLanguage(javaCode);
  console.log('Detected language:', javaLanguage);
  const javaMermaid = await convertToMermaid(javaCode, 'java');
  if (javaMermaid) {
    console.log('Java Mermaid Output:');
    console.log(javaMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // JavaScript program
  const jsCode = fs.readFileSync(path.join(__dirname, 'tests', 'javascript', 'hello.js'), 'utf8');
  console.log('JavaScript Program:');
  console.log(jsCode);
  const jsLanguage = await detectLanguage(jsCode);
  console.log('Detected language:', jsLanguage);
  const jsMermaid = await convertToMermaid(jsCode, 'js');
  if (jsMermaid) {
    console.log('JavaScript Mermaid Output:');
    console.log(jsMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Python program
  const pyCode = fs.readFileSync(path.join(__dirname, 'tests', 'python', 'hello.py'), 'utf8');
  console.log('Python Program:');
  console.log(pyCode);
  const pyLanguage = await detectLanguage(pyCode);
  console.log('Detected language:', pyLanguage);
  const pyMermaid = await convertToMermaid(pyCode, 'py');
  if (pyMermaid) {
    console.log('Python Mermaid Output:');
    console.log(pyMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // TypeScript program
  const tsCode = fs.readFileSync(path.join(__dirname, 'tests', 'javascript', 'hello.ts'), 'utf8');
  console.log('TypeScript Program:');
  console.log(tsCode);
  const tsLanguage = await detectLanguage(tsCode);
  console.log('Detected language:', tsLanguage);
  const tsMermaid = await convertToMermaid(tsCode, 'ts');
  if (tsMermaid) {
    console.log('TypeScript Mermaid Output:');
    console.log(tsMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // NEW: Test input and print programs
  console.log('Testing conversion of input and print programs...\n');
  
  // C input/print program
  const cInputCode = fs.readFileSync(path.join(__dirname, 'tests', 'c', 'input_print.c'), 'utf8');
  console.log('C Input/Print Program:');
  console.log(cInputCode);
  const cInputLanguage = await detectLanguage(cInputCode);
  console.log('Detected language:', cInputLanguage);
  const cInputMermaid = await convertToMermaid(cInputCode, 'c');
  if (cInputMermaid) {
    console.log('C Input/Print Mermaid Output:');
    console.log(cInputMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // C++ input/print program
  const cppInputCode = fs.readFileSync(path.join(__dirname, 'tests', 'cpp', 'input_print.cpp'), 'utf8');
  console.log('C++ Input/Print Program:');
  console.log(cppInputCode);
  const cppInputLanguage = await detectLanguage(cppInputCode);
  console.log('Detected language:', cppInputLanguage);
  const cppInputMermaid = await convertToMermaid(cppInputCode, 'cpp');
  if (cppInputMermaid) {
    console.log('C++ Input/Print Mermaid Output:');
    console.log(cppInputMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Java input/print program
  const javaInputCode = fs.readFileSync(path.join(__dirname, 'tests', 'java', 'InputPrint.java'), 'utf8');
  console.log('Java Input/Print Program:');
  console.log(javaInputCode);
  const javaInputLanguage = await detectLanguage(javaInputCode);
  console.log('Detected language:', javaInputLanguage);
  const javaInputMermaid = await convertToMermaid(javaInputCode, 'java');
  if (javaInputMermaid) {
    console.log('Java Input/Print Mermaid Output:');
    console.log(javaInputMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Python input/print program
  const pyInputCode = fs.readFileSync(path.join(__dirname, 'tests', 'python', 'input_print.py'), 'utf8');
  console.log('Python Input/Print Program:');
  console.log(pyInputCode);
  const pyInputLanguage = await detectLanguage(pyInputCode);
  console.log('Detected language:', pyInputLanguage);
  const pyInputMermaid = await convertToMermaid(pyInputCode, 'py');
  if (pyInputMermaid) {
    console.log('Python Input/Print Mermaid Output:');
    console.log(pyInputMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // JavaScript input/print program
  const jsInputCode = fs.readFileSync(path.join(__dirname, 'tests', 'javascript', 'input_print.js'), 'utf8');
  console.log('JavaScript Input/Print Program:');
  console.log(jsInputCode);
  const jsInputLanguage = await detectLanguage(jsInputCode);
  console.log('Detected language:', jsInputLanguage);
  const jsInputMermaid = await convertToMermaid(jsInputCode, 'js');
  if (jsInputMermaid) {
    console.log('JavaScript Input/Print Mermaid Output:');
    console.log(jsInputMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // NEW: Test assignment program
  console.log('Testing conversion of assignment program...\n');
  
  // C assignment program
  const cAssignmentCode = fs.readFileSync(path.join(__dirname, 'tests', 'c', 'assignment_test.c'), 'utf8');
  console.log('C Assignment Program:');
  console.log(cAssignmentCode);
  const cAssignmentLanguage = await detectLanguage(cAssignmentCode);
  console.log('Detected language:', cAssignmentLanguage);
  const cAssignmentMermaid = await convertToMermaid(cAssignmentCode, 'c');
  if (cAssignmentMermaid) {
    console.log('C Assignment Mermaid Output:');
    console.log(cAssignmentMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Python assignment program
  const pyAssignmentCode = fs.readFileSync(path.join(__dirname, 'tests', 'python', 'assignment_test.py'), 'utf8');
  console.log('Python Assignment Program:');
  console.log(pyAssignmentCode);
  const pyAssignmentLanguage = await detectLanguage(pyAssignmentCode);
  console.log('Detected language:', pyAssignmentLanguage);
  const pyAssignmentMermaid = await convertToMermaid(pyAssignmentCode, 'py');
  if (pyAssignmentMermaid) {
    console.log('Python Assignment Mermaid Output:');
    console.log(pyAssignmentMermaid);
  }
  console.log('\n' + '='.repeat(50) + '\n');
  
  // NEW: Test Python input assignment
  const pyInputAssignmentCode = fs.readFileSync(path.join(__dirname, 'tests', 'python', 'input_assignment_test.py'), 'utf8');
  console.log('Python Input Assignment Program:');
  console.log(pyInputAssignmentCode);
  const pyInputAssignmentLanguage = await detectLanguage(pyInputAssignmentCode);
  console.log('Detected language:', pyInputAssignmentLanguage);
  const pyInputAssignmentMermaid = await convertToMermaid(pyInputAssignmentCode, 'py');
  if (pyInputAssignmentMermaid) {
    console.log('Python Input Assignment Mermaid Output:');
    console.log(pyInputAssignmentMermaid);
  }
}

// Run the tests
testConversions().catch(console.error);