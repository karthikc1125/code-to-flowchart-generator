import { generateMermaid } from './src/index.mjs';

const cppCode = `#include <iostream>
using namespace std;

int main() {
    int number;
    cout << "Enter a number: ";
    cin >> number;
    cout << "You entered: " << number << endl;
    return 0;
}`;

async function test() {
  try {
    const result = await generateMermaid({ code: cppCode, language: 'cpp' });
    console.log('C++ Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();