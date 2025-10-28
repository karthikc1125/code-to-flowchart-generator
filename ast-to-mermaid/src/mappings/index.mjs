import * as js from './javascript.mjs';
import * as ts from './typescript.mjs';
import * as c from './c.mjs';
import * as cpp from './cpp.mjs';
import * as java from './java.mjs';
import * as python from './python.mjs';

const map = {
  // Core languages
  js,
  javascript: js,
  ts: ts,
  typescript: ts,
  c,
  cpp,
  cxx: cpp,
  cc: cpp,
  java,
  py: python,
  python,
};

export function getLanguageMapper(language) {
  const key = String(language || '').toLowerCase();
  const m = map[key];
  if (!m) throw new Error(`No mapper for language: ${language}`);
  return m;
}

