// Debug script to test isLoop function
import { javascriptConfig } from './src/mappings/javascript-config.mjs';

const forStatement = { type: 'for_statement' };
console.log('isLoop result:', javascriptConfig.isLoop(forStatement));