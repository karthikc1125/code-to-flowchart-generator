import { createFlowBuilder } from './src/mappings/_common.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { typescriptConfig } from './src/mappings/typescript-config.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';
import { javaConfig } from './src/mappings/java-config.mjs';
import { cppConfig } from './src/mappings/cpp-config.mjs';
import { normalizeTree } from './src/normalize.mjs';

import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import Python from 'tree-sitter-python';
import Java from 'tree-sitter-java';
import Cpp from 'tree-sitter-cpp';

function testLanguage(name, langData, config, code) {
  console.log("=== " + name + " ===");
  try {
    const parser = new Parser();
    parser.setLanguage(langData);
    const tree = parser.parse(code);
    const normalized = normalizeTree(tree);
    const flowchart = generateCommonFlowchart([normalized], config);
    console.log(flowchart);
    console.log('\\n');
  } catch(e) {
    console.error("Failed to parse " + name, e);
  }
}

testLanguage('JavaScript', JavaScript, javascriptConfig, `
try {
  let user = readUser();
  console.log("Found user");
  if (user == null) {
      throw new Error("No user");
  }
} catch (error) {
  console.log("Handled: " + error);
} finally {
  console.log("Cleanup");
}
`);

testLanguage('Java', Java, javaConfig, `
class Main {
  public static void main(String[] args) {
    try {
      System.out.println("Processing");
      process(data);
    } catch (IOException e) {
      System.out.println("IO Error");
    } catch (Exception x) {
      System.out.println("Generic");
    } finally {
      System.out.println("Done");
    }
  }
}
`);

testLanguage('Python', Python, pythonConfig, `
try:
    print("Reading")
    data = read()
except ValueError as v:
    print("Value error")
except Exception as e:
    print("Error")
finally:
    print("Cleanup")
`);

testLanguage('C++', Cpp, cppConfig, `
int main() {
    try {
        cout << "Trying something";
        execute();
    } catch (const exception& e) {
        cout << "Caught: " << e.what();
    }
    return 0;
}
`);
