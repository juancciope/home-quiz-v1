/**
 * Debug Scoring Logic
 * Created: 2025-01-18T11:10:00Z
 */

import { scoreUser } from './lib/scoring/index.js';

// Test case that should show 60% as Core Focus (threshold: 75%)
const testCase = {
  'motivation': 'behind-scenes',
  'ideal-day': 'studio-work', 
  'success-vision': 'in-demand-producer',
  'success-definition': 'songwriter',
  'stage-level': 'scale'
};

console.log('=== Debug: Should 60% be Core Focus? ===');
const result = scoreUser(testCase);
console.log('Display %:', result.displayPct);
console.log('Absolute %:', result.absPct);
console.log('Levels:', result.levels);
console.log('Recommendation:', result.recommendation);

// Check threshold logic
const writerProducerAbs = result.absPct['writer-producer'];
console.log(`\nWriter-Producer absolute: ${writerProducerAbs}%`);
console.log(`Should be Core Focus (≥75%): ${writerProducerAbs >= 75 ? 'YES' : 'NO'}`);
console.log(`Current level: ${result.levels['writer-producer']}`);

// Check if the issue is in levelFromPct function
console.log(`\nNew Threshold check:`);
console.log(`60 >= 60: ${60 >= 60} (Core Focus)`);
console.log(`48 >= 35: ${48 >= 35} (Strategic Secondary)`);
console.log(`17 >= 35: ${17 >= 35} (Should be Noise)`);