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
      enum: ['live-performance', 'artistic-expression', 'collaboration', 'multiple'],
      required: true
    },
    idealDay: {
      type: String,
      enum: ['performing-travel', 'releasing-music', 'writing-creating', 'varied'],
      required: true
    },
    successVision: {
      type: String,
      enum: ['touring-headliner', 'passive-income-artist', 'hit-songwriter', 'hybrid'],
      required: true
    },
    stageLevel: {
      type: String,
      enum: ['planning', 'production', 'scale'],
      required: true
    },
    successDefinition: {
      type: String,
      enum: ['audience-impact', 'creative-fulfillment', 'financial-freedom', 'balanced-all'],
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