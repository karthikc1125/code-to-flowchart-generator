ast-to-mermaid

Node.js service that converts code into refined Mermaid flowcharts using Tree‑sitter ASTs.

## Endpoints

- POST /convert
  - body: { code: string, language?: 'auto'|'js'|'ts'|'python'|'java'|'c'|'cpp' }
  - returns: { mermaid: string, detectedLanguage: string }

- POST /detect
  - body: { code: string }
  - returns: { detectedLanguage: string }

## Run locally

```
cd ast-to-mermaid
npm install
npm run serve
```

## Language Support

- JavaScript, TypeScript: mapper wrappers + configs
- Python: mapper wrapper + config
- Java: wrapper + config (extracts method calls like System.out.println)
- C++: wrapper + config (handles cout << and printf)
- C: wrapper + config (handles printf/puts)

## Architecture

- src/parser.mjs: Tree‑sitter setup and language map
- src/index.mjs: generateMermaid entry
- src/language-detect.mjs: heuristics for 6 core languages
- src/mappings/_common.mjs: flowchart builder utilities
- src/mappings/common-flowchart.mjs: shared AST→flowchart engine
- src/mappings/*-config.mjs: language configs (node type detection + extraction)
- src/mappings/*.mjs: thin wrappers calling the common engine with a config

## Directory Structure

- [bin/](bin/): Command-line interface
- [docs/](docs/): Documentation
  - [api/](docs/api/): API reference
  - [guides/](docs/guides/): User guides
- [examples/](examples/): Example source code files
- [src/](src/): Source code
  - [mappings/](src/mappings/): Language-specific mapping files
- [tests/](tests/): Test files
  - [c/](tests/c/): C language tests
  - [cpp/](tests/cpp/): C++ language tests
  - [java/](tests/java/): Java language tests
  - [javascript/](tests/javascript/): JavaScript language tests
  - [python/](tests/python/): Python language tests
  - [unit/](tests/unit/): Unit tests
  - [integration/](tests/integration/): Integration tests

## Notes

- The common engine always creates one end node and connects pending branches.
- If a snippet falls back to start→end, extend the corresponding *-config.mjs.


