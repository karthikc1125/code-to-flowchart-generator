import { loadParserForLanguage } from './parser.mjs';
import { detectLanguage } from './language-detect.mjs';
import { normalizeTree } from './normalize.mjs';
import { walkAst } from './walker.mjs';
import { getLanguageMapper } from './mappings/index.mjs';

export async function generateMermaid({ code, language }) {
  const chosenLanguage = (!language || language === 'auto') ? detectLanguage(String(code || '')) : language;
  const { parser, languageModule } = await loadParserForLanguage(chosenLanguage);
  const tree = parser.parse(code);
  const normalized = normalizeTree(tree, languageModule);
  const mapper = getLanguageMapper(chosenLanguage);
  const mermaid = mapper.mapToMermaid(Array.from(walkAst(normalized)), chosenLanguage);
  return mermaid;
}

export default { generateMermaid };

