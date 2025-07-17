/**
 * Scoring configuration for v2 scoring logic
 */

const PATHS = ['touring-performer', 'creative-artist', 'writer-producer'];

const QUESTION_WEIGHTS = {
  'motivation': 0.25,
  'ideal-day': 0.20,
  'success-vision': 0.10,
  'success-definition': 0.40,
  'stage-level': 0.05, // excluded from path scoring
};

// FUZZY_MATRIX keyed by question -> answer -> path weight
const FUZZY_MATRIX = {
  'motivation': {
    'stage-energy': { 
      'touring-performer': 1.00, 
      'creative-artist': 0.30, 
      'writer-producer': 0.10 
    },
    'creative-expression': { 
      'touring-performer': 0.20, 
      'creative-artist': 1.00, 
      'writer-producer': 0.40 
    },
    'behind-scenes': { 
      'touring-performer': 0.10, 
      'creative-artist': 0.30, 
      'writer-producer': 1.00 
    },
  },
  'ideal-day': {
    'performing': { 
      'touring-performer': 1.00, 
      'creative-artist': 0.25, 
      'writer-producer': 0.10 
    },
    'creating-content': { 
      'touring-performer': 0.20, 
      'creative-artist': 1.00, 
      'writer-producer': 0.25 
    },
    'studio-work': { 
      'touring-performer': 0.10, 
      'creative-artist': 0.25, 
      'writer-producer': 1.00 
    },
  },
  'success-vision': {
    'touring-artist': { 
      'touring-performer': 1.00, 
      'creative-artist': 0.20, 
      'writer-producer': 0.10 
    },
    'creative-brand': { 
      'touring-performer': 0.20, 
      'creative-artist': 1.00, 
      'writer-producer': 0.20 
    },
    'in-demand-producer': { 
      'touring-performer': 0.10, 
      'creative-artist': 0.20, 
      'writer-producer': 1.00 
    },
  },
  'success-definition': {
    'live-performer': { 
      'touring-performer': 1.00, 
      'creative-artist': 0.05, 
      'writer-producer': 0.05 
    },
    'online-audience': { 
      'touring-performer': 0.05, 
      'creative-artist': 1.00, 
      'writer-producer': 0.05 
    },
    'songwriter': { 
      'touring-performer': 0.05, 
      'creative-artist': 0.05, 
      'writer-producer': 1.00 
    },
  },
  // stage-level omitted from scoring
};

const DISPLAY_TOP_CAP = 97;

module.exports = {
  PATHS,
  QUESTION_WEIGHTS,
  FUZZY_MATRIX,
  DISPLAY_TOP_CAP
};