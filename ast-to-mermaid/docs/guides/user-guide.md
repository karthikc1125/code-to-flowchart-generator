# User Guide

This guide explains how to use the AST-to-Mermaid converter to generate flowcharts from source code.

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Command Line Interface

The tool can be used from the command line:

```bash
node bin/cli.mjs [input-file] [output-file]
```

Example:
```bash
node bin/cli.mjs examples/c/example.c output.md
```

### Programmatic Usage

You can also use the tool programmatically in your JavaScript code:

```javascript
import { mapCToFlowchart } from './src/mappings/c.mjs';

const code = `
#include <stdio.h>
int main() {
    int x = 5;
    if (x > 0) {
        printf("Positive");
    }
    return 0;
}
`;

const flowchart = mapCToFlowchart(code);
console.log(flowchart);
```

## Supported Languages

The tool currently supports the following programming languages:

- C
- C++
- Java
- JavaScript
- Python

## Flowchart Elements

The generated flowcharts use different shapes to represent different types of statements:

- **Rounded rectangles** - Start and end nodes
- **Rectangles** - Process statements (assignments, function calls)
- **Diamonds** - Conditional statements (if, switch)
- **Hexagons** - Loop statements (for, while)
- **Flags** - Return statements
- **Subgraphs** - User-defined functions

## Examples

### C Example

Input:
```c
#include <stdio.h>
int main() {
    int x = 5;
    if (x > 0) {
        printf("Positive");
    }
    return 0;
}
```

Output:
```mermaid
flowchart TD
    N1([start])
    N2([int x = 5])
    N1 --> N2
    N3{x > 0?}
    N2 --> N3
    N4[/printf "Positive"/]
    N3 --yes--> N4
    N5>[return 0]
    N3 --no--> N5
    N4 --> N5
    N6([end])
    N5 --> N6
```

## Customization

You can customize the generated flowcharts by modifying the language configuration files in the [src/mappings](../../src/mappings/) directory.

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined" error** - This usually occurs when the AST parser fails to parse the code. Check that your code is syntactically correct.

2. **Missing flowchart elements** - Some language constructs may not be fully supported yet. Check the language configuration files to see what is currently supported.

### Debugging

Use the debug scripts in the [tests/unit](../../tests/unit/) directory to troubleshoot issues:

```bash
node tests/unit/debug-cli.mjs [input-file]
```

This will show the parsed AST and help identify parsing issues.