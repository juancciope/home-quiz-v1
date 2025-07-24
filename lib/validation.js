// Email validation
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate quiz responses
export function validateQuizResponses(responses) {
  const errors = [];
  
  if (!responses) {
    errors.push('Responses object is required');
    return errors;
  }
  
  // Required fields
  const requiredFields = ['motivation', 'ideal-day', 'success-vision', 'stage-level', 'success-definition'];
  
  for (const field of requiredFields) {
    if (!responses[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate enum values
  const validValues = {
    motivation: ['live-performance', 'artistic-expression', 'collaboration', 'multiple'],
    'ideal-day': ['performing-travel', 'releasing-music', 'writing-creating', 'varied'],
    'success-vision': ['touring-headliner', 'passive-income-artist', 'hit-songwriter', 'hybrid'],
    'stage-level': ['planning', 'production', 'scale'],
    'success-definition': ['audience-impact', 'creative-fulfillment', 'financial-freedom', 'balanced-all']
  };
  
  for (const [field, validOptions] of Object.entries(validValues)) {
    if (responses[field] && !validOptions.includes(responses[field])) {
      errors.push(`Invalid value for ${field}: ${responses[field]}`);
    }
  }
  
  return errors;
}

// Sanitize user input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove any potential script tags or HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Validate pathway
export function isValidPathway(pathway) {
  const validPathways = ['touring-performer', 'creative-artist', 'writer-producer'];
  return validPathways.includes(pathway);
}