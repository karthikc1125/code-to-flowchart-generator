import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import { normalizeTree } from './src/normalize.mjs';

const parser = new Parser();
parser.setLanguage(JavaScript);

const code = `
try {
  console.log("try");
  throw new Error("fail");
} catch (e) {
  console.log("catch");
} finally {
  console.log("finally");
}
`;

const tree = parser.parse(code);
const normalized = normalizeTree(tree);

console.log(JSON.stringify(normalized.children, null, 2));
