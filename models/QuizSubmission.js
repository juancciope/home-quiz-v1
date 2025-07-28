import mongoose from 'mongoose';

const QuizSubmissionSchema = new mongoose.Schema({
  artistProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtistProfile',
    required: true
  },
  
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  responses: {
    motivation: {
      type: String,
      enum: ['stage-energy', 'creative-expression', 'behind-scenes'],
      required: true
    },
    idealDay: {
      type: String,
      enum: ['performing', 'creating-content', 'studio-work'],
      required: true
    },
    successVision: {
      type: String,
      enum: ['touring-artist', 'creative-brand', 'in-demand-producer'],
      required: true
    },
    stageLevel: {
      type: String,
      enum: ['planning', 'production', 'scale'],
      required: true
    },
    successDefinition: {
      type: String,
      enum: ['live-performer', 'online-audience', 'songwriter'],
      required: true
    },
    resourcesPriority: String
  },
  
  results: {
    fuzzyScores: {
      'touring-performer': {
        type: Number,
        min: 0,
        max: 100
      },
      'creative-artist': {
        type: Number,
        min: 0,
        max: 100
      },
      'writer-producer': {
        type: Number,
        min: 0,
        max: 100
      }
    },
    recommendation: {
      pathway: {
        type: String,
        enum: ['touring-performer', 'creative-artist', 'writer-producer']
      },
      description: String,
      nextSteps: [{
        priority: Number,
        step: String,
        detail: String
      }],
      resources: [String],
      companies: [{
        name: String,
        description: String,
        url: String
      }]
    },
    pathwayDetails: mongoose.Schema.Types.Mixed,
    aiGenerated: {
      type: Boolean,
      default: false
    },
    scoreResult: mongoose.Schema.Types.Mixed
  },
  
  source: {
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    referrer: String,
    device: String,
    ip: String,
    userAgent: String
  },
  
  // Survey responses for retargeting
  surveyResponses: {
    // Experience Metrics
    nps: {
      type: Number,
      min: 1,
      max: 10
    },
    ces: {
      type: Number,
      min: 1,
      max: 10
    },
    // Your Music Creator Journey
    challenges: [String],
    goals_2025: [String],
    learning_preference: String,
    // Tools & Software Usage
    tool_needs: [String],
    service_pricing: {
      'content-calendar': Number,
      'data-insights': Number,
      'collaboration-matching': Number,
      'tour-planning': Number,
      'marketing-services': Number,
      'release-management': Number
    },
    // Collaboration & Community
    genres: [String],
    'collaboration-skills': [String],
    'seeking-skills': [String],
    // Industry Connections & Goals
    'industry-connections': [String],
    'gear-discovery': [String],
    // Feedback
    feedback: String
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
QuizSubmissionSchema.index({ email: 1 });
QuizSubmissionSchema.index({ artistProfileId: 1 });
QuizSubmissionSchema.index({ submittedAt: -1 });
QuizSubmissionSchema.index({ 'results.recommendation.pathway': 1 });

const QuizSubmission = mongoose.models.QuizSubmission || mongoose.model('QuizSubmission', QuizSubmissionSchema);

export default QuizSubmission;