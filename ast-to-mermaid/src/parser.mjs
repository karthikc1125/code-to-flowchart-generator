import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import TypeScript from 'tree-sitter-typescript';
import C from 'tree-sitter-c';
import CPP from 'tree-sitter-cpp';
import Java from 'tree-sitter-java';
import Python from 'tree-sitter-python';

const TYPESCRIPT_TSX = TypeScript.tsx;
const TYPESCRIPT_TS = TypeScript.typescript;

const languageMap = {
  // Core languages
  js: JavaScript,
  javascript: JavaScript,
  ts: TYPESCRIPT_TS,
  typescript: TYPESCRIPT_TS,
  tsx: TYPESCRIPT_TSX,
  c: C,
  cpp: CPP,
  cxx: CPP,
  cc: CPP,
  java: Java,
  py: Python,
  python: Python,
};

export async function loadParserForLanguage(language) {
  const key = String(language || '').toLowerCase();
  const languageModule = languageMap[key];
  if (!languageModule) {
    throw new Error(`Unsupported language: ${language}`);
  }
  const parser = new Parser();
  parser.setLanguage(languageModule);
  return { parser, languageModule };
}

export function getSupportedLanguages() {
  return Object.keys(languageMap);
}

