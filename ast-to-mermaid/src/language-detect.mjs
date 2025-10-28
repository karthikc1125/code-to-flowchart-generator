// Heuristic language detector for 6 core languages: js, ts, python, java, c, cpp

export function detectLanguage(code) {
  const src = String(code || '');
  const trimmed = src.trim();

  // Quick markers
  const hasSemicolon = /;\s*$|;\s*\n/m.test(trimmed);
  const hasBraces = /\{|\}/.test(trimmed);
  const hasImports = /^(import\s+.*from\s+['"][^'"]+['"]|#include\s+<.*>|using\s+namespace\s+std;)/m.test(trimmed);
  const hasShebangPy = /^#!.*python/.test(trimmed);

  // Java markers - check this BEFORE other languages since Java can contain print-like statements
  // Enhanced Java detection to better catch cases like InputPrint.java
  if (/\bpublic\s+class\s+\w+|System\.out\.print|public\s+static\s+void\s+main\s*\(String\[\]|Scanner\s+\w+|\.nextInt\(|\.next\(|import\s+java\.util\.Scanner|import\s+java\./.test(trimmed)) return 'java';

  // Python - check AFTER Java to avoid false positives
  if (hasShebangPy || (/def\s+\w+\(|:\n\s+/.test(trimmed) && !/System\.out\.print|public\s+static\s+void\s+main/.test(trimmed))) {
    // Additional check to make sure it's not Java with print statements
    if (!/\bpublic\s+class\s+\w+|System\.out\.print|public\s+static\s+void\s+main\s*\(String\[\]/.test(trimmed)) {
      return 'python';
    }
  }

  // C/C++ includes
  if (/^#include\s+</m.test(trimmed)) {
    // Look for C++-specific markers (more specific patterns)
    if (/\bstd::\w+|cout\s*<<|cin\s*>>|\bclass\s+[a-zA-Z_]\w*\s*\{/.test(trimmed)) return 'cpp';
    // If we have #include but no C++ markers, assume C
    return 'c';
  }

  // C language detection - detect common C functions and patterns
  if (/\bprintf\s*\(|\bscanf\s*\(|\bfprintf\s*\(|\bfscanf\s*\(|\bgetc\s*\(|\bputc\s*\(|\bfopen\s*\(|\bfclose\s*\(|\bmalloc\s*\(|\bfree\s*\(|\bstrlen\s*\(|\bstrcpy\s*\(|\bstrcat\s*\(/.test(trimmed)) return 'c';

  // C++ detection - look for C++ specific markers without #include (more specific patterns)
  if (/\bstd::\w+|cout\s*<<|cin\s*>>|\bclass\s+[a-zA-Z_]\w*\s*\{/.test(trimmed)) return 'cpp';

  // TypeScript vs JavaScript
  // TypeScript type annotations / interfaces / enums
  if (/\binterface\s+\w+|\benum\s+\w+|:\s*\w+(<.*>)?\s*(=|;|,|\))/.test(trimmed)) return 'typescript';

  // Default to JS when using console.log, import/export, arrow functions
  if (/console\.log\(|export\s+(default\s+)?|import\s+.*from\s+['"][^'"]+['"]|=>/.test(trimmed)) return 'js';

  // Fallback heuristics
  if (hasImports && /using\s+namespace\s+std;/.test(trimmed)) return 'cpp';
  if (hasBraces && hasSemicolon) return 'js';

  return 'js';
}