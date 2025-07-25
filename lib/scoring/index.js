/**
 * Scoring Logic v2 implementation
 * Last Updated: 2025-01-18T11:15:00Z
 * Version: 2.3.0
 * Changes: Adjusted thresholds to 60%/35% for better user experience
 */

const { PATHS, QUESTION_WEIGHTS, FUZZY_MATRIX, DISPLAY_TOP_CAP } = require('./config.js');

/**
 * Compute theoretical max & min raw scores per path across scored questions.
 * Excludes 'stage-level'.
 * @returns {{maxPer: Object, minPer: Object}}
 */
function buildPathBounds() {
  const maxPer = { 
    'touring-performer': 0, 
    'creative-artist': 0, 
    'writer-producer': 0 
  };
  const minPer = { 
    'touring-performer': 0, 
    'creative-artist': 0, 
    'writer-producer': 0 
  };

  Object.entries(FUZZY_MATRIX).forEach(([q, answers]) => {
    if (q === 'stage-level') return;
    const w = QUESTION_WEIGHTS[q] ?? 0;
    if (!w) return;
    
    for (const p of PATHS) {
      const vals = Object.values(answers).map(a => a[p] ?? 0);
      const maxV = Math.max(...vals);
      const minV = Math.min(...vals);
      maxPer[p] += maxV * w;
      minPer[p] += minV * w;
    }
  });
  
  return { maxPer, minPer };
}

const PATH_BOUNDS = buildPathBounds();

/**
 * Build raw weighted scores from user responses (excluding stage-level).
 * @param {Object} responses - map of questionId -> answerId
 * @returns {Object} raw scores per path
 */
function accumulateRaw(responses) {
  const raw = { 
    'touring-performer': 0, 
    'creative-artist': 0, 
    'writer-producer': 0 
  };

  Object.entries(responses).forEach(([q, answer]) => {
    if (q === 'stage-level') return;
    const w = QUESTION_WEIGHTS[q] ?? 0;
    if (!w) return;
    
    const contrib = FUZZY_MATRIX[q]?.[answer];
    if (!contrib) return; // unknown key safe ignore
    
    for (const p of PATHS) {
      raw[p] += (contrib[p] ?? 0) * w;
    }
  });

  return raw;
}

/**
 * Absolute alignment % (raw / max).
 * @param {Object} raw - raw scores
 * @returns {Object} absolute percentages
 */
function toAbsolutePct(raw) {
  const out = {};
  for (const p of PATHS) {
    const max = PATH_BOUNDS.maxPer[p] || 1;
    out[p] = (raw[p] / max) * 100;
  }
  return out;
}

/**
 * Floor-adjusted % ((raw-min)/(max-min)).
 * @param {Object} raw - raw scores
 * @returns {Object} floor-adjusted percentages
 */
function toFloorAdjustedPct(raw) {
  const out = {};
  for (const p of PATHS) {
    const max = PATH_BOUNDS.maxPer[p];
    const min = PATH_BOUNDS.minPer[p];
    const span = (max - min) || 1;
    const adj = Math.max(0, raw[p] - min);
    out[p] = (adj / span) * 100;
  }
  return out;
}

/**
 * Scale so top == DISPLAY_TOP_CAP; preserve ratios.
 * @param {Object} floatPct - float percentages
 * @returns {Object} scaled display percentages (rounded integers)
 */
function scaleDisplayPct(floatPct) {
  const out = {};
  const top = Math.max(...Object.values(floatPct));
  const scale = top > 0 ? DISPLAY_TOP_CAP / top : 0;
  
  for (const [p, v] of Object.entries(floatPct)) {
    out[p] = Math.round(v * scale);
  }
  
  return out;
}

/**
 * Level from absolute %
 * @param {number} pct - absolute percentage
 * @param {boolean} skipCoreFocus - if true, skip Core Focus assignment (for demotion)
 * @returns {string} level label
 */
function levelFromPct(pct, skipCoreFocus = false) {
  if (!skipCoreFocus && pct >= 60) return 'Core Focus';
  if (pct >= 35) return 'Strategic Secondary';
  return 'Noise';
}

/**
 * Blend type from absolute % map
 * @param {Object} absPct - absolute percentages
 * @returns {string} blend type
 */
function blendFromAbs(absPct) {
  const sorted = Object.entries(absPct).sort((a, b) => b[1] - a[1]);
  const v1 = sorted[0][1];
  const v2 = sorted[1][1];
  
  if ((v1 - v2) < 10) return 'Hybrid Multi-Creator';
  if (v2 >= 35) return 'Blend 70/30';
  return 'Focused';
}

/**
 * Derive recommendation based on absolute percentages and levels
 * @param {Object} absPct - absolute percentages
 * @param {Object} levels - focus levels
 * @returns {Object} recommendation object
 */
function deriveRecommendation(absPct, levels) {
  // sort by absolute %
  const sorted = Object.entries(absPct).sort((a,b)=>b[1]-a[1]);
  const [topPath, topVal] = sorted[0];

  // detect if any path already Core
  const hasCore = Object.values(levels).includes('Core Focus');

  if (hasCore) {
    return {
      path: topPath,
      confidence: topVal,
      label: 'Core Focus',
      promoted: false,
    };
  }

  // no Core → promote top path
  return {
    path: topPath,
    confidence: topVal,
    label: 'Recommended Focus',
    promoted: true,
  };
}

/**
 * Main scoring wrapper.
 * @param {Object} responses - map of questionId -> answerId
 * @returns {Object} complete score result
 */
function scoreUser(responses) {
  const raw = accumulateRaw(responses);
  const absPct = toAbsolutePct(raw);
  const floatDisplay = toFloorAdjustedPct(raw);
  const displayPct = scaleDisplayPct(floatDisplay);
  
  // First assign levels based on thresholds
  const levels = {};
  for (const p of PATHS) {
    levels[p] = levelFromPct(absPct[p]);
  }
  
  // CRITICAL FIX: Ensure highest scoring path always gets "Core Focus"
  // Find the highest scoring path(s)
  const sortedPaths = Object.entries(absPct).sort((a, b) => b[1] - a[1]);
  const highestPath = sortedPaths[0][0];
  const highestScore = sortedPaths[0][1];
  
  // If the highest path doesn't have "Core Focus", promote it
  if (levels[highestPath] !== 'Core Focus') {
    levels[highestPath] = 'Core Focus';
  }
  
  // If multiple paths have "Core Focus", demote all but the highest scorer
  const corePaths = Object.entries(levels).filter(([_, level]) => level === 'Core Focus');
  if (corePaths.length > 1) {
    // Keep only the highest scoring path as "Core Focus"
    for (const [path, _] of corePaths) {
      if (path !== highestPath) {
        // Demote to appropriate level based on threshold
        levels[path] = levelFromPct(absPct[path], true); // Skip Core Focus check
      }
    }
  }
  
  const blendType = blendFromAbs(absPct);
  const recommendation = deriveRecommendation(absPct, levels);
  
  return {
    raw,
    absPct,
    displayPct,
    levels,
    blendType,
    recommendation,
    stageLevel: responses['stage-level'],
  };
}

module.exports = {
  buildPathBounds,
  accumulateRaw,
  toAbsolutePct,
  toFloorAdjustedPct,
  scaleDisplayPct,
  levelFromPct,
  blendFromAbs,
  deriveRecommendation,
  scoreUser
};