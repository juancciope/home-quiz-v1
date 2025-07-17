/**
 * Manual test script for scoring v2
 * Run with: node lib/scoring/manual-test.js
 */

const { scoreUser } = require('./index.js');

console.log('=== Scoring v2 Manual Tests ===\n');

// Test 1: Pure Performer
console.log('TEST 1: Pure Performer');
console.log('Responses:', {
  motivation: 'stage-energy',
  'ideal-day': 'performing',
  'success-vision': 'touring-artist',
  'success-definition': 'live-performer',
  'stage-level': 'planning'
});

const result1 = scoreUser({
  motivation: 'stage-energy',
  'ideal-day': 'performing',
  'success-vision': 'touring-artist',
  'success-definition': 'live-performer',
  'stage-level': 'planning'
});

console.log('Raw scores:', result1.raw);
console.log('absPct(round):', Object.fromEntries(Object.entries(result1.absPct).map(([k,v])=>[k,Math.round(v)])));
console.log('displayPct:', result1.displayPct);
console.log('levels:', result1.levels);
console.log('blendType:', result1.blendType);
console.log('recommendation:', result1.recommendation);
console.log('Stage Level:', result1.stageLevel);
console.log('\n---\n');

// Test 2: Performer + Artist blend
console.log('TEST 2: Performer + Artist Blend');
console.log('Responses:', {
  motivation: 'stage-energy',
  'ideal-day': 'creating-content',
  'success-vision': 'creative-brand',
  'success-definition': 'live-performer',
  'stage-level': 'production'
});

const result2 = scoreUser({
  motivation: 'stage-energy',
  'ideal-day': 'creating-content',
  'success-vision': 'creative-brand',
  'success-definition': 'live-performer',
  'stage-level': 'production'
});

console.log('Raw scores:', result2.raw);
console.log('absPct(round):', Object.fromEntries(Object.entries(result2.absPct).map(([k,v])=>[k,Math.round(v)])));
console.log('displayPct:', result2.displayPct);
console.log('levels:', result2.levels);
console.log('blendType:', result2.blendType);
console.log('recommendation:', result2.recommendation);
console.log('Stage Level:', result2.stageLevel);
console.log('\n---\n');

// Test 3: Balanced
console.log('TEST 3: Balanced');
console.log('Responses:', {
  motivation: 'creative-expression',
  'ideal-day': 'studio-work',
  'success-vision': 'touring-artist',
  'success-definition': 'online-audience',
  'stage-level': 'scale'
});

const result3 = scoreUser({
  motivation: 'creative-expression',
  'ideal-day': 'studio-work',
  'success-vision': 'touring-artist',
  'success-definition': 'online-audience',
  'stage-level': 'scale'
});

console.log('Raw scores:', result3.raw);
console.log('absPct(round):', Object.fromEntries(Object.entries(result3.absPct).map(([k,v])=>[k,Math.round(v)])));
console.log('displayPct:', result3.displayPct);
console.log('levels:', result3.levels);
console.log('blendType:', result3.blendType);
console.log('recommendation:', result3.recommendation);
console.log('Stage Level:', result3.stageLevel);
console.log('\n=== Tests Complete ===');