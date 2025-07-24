import mongoose from 'mongoose';

const ArtistProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  profile: {
    name: String,
    stageName: String,
    bio: String,
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    genres: [String],
    instruments: [String],
    roles: [String]
  },
  
  pathways: {
    primary: {
      type: {
        type: String,
        enum: ['touring-performer', 'creative-artist', 'writer-producer']
      },
      score: Number,
      level: {
        type: String,
        enum: ['Core Focus', 'Strategic Secondary', 'Noise']
      },
      focusAreas: [String],
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    secondary: {
      type: {
        type: String,
        enum: ['touring-performer', 'creative-artist', 'writer-producer']
      },
      score: Number,
      level: {
        type: String,
        enum: ['Core Focus', 'Strategic Secondary', 'Noise']
      }
    },
    history: [{
      date: {
        type: Date,
        default: Date.now
      },
      scores: {
        'touring-performer': Number,
        'creative-artist': Number,
        'writer-producer': Number
      },
      recommendation: String
    }]
  },
  
  career: {
    stage: {
      type: String,
      enum: ['planning', 'production', 'scale'],
      default: 'planning'
    },
    startedAt: Date,
    milestones: [{
      type: String,
      description: String,
      achievedAt: Date
    }]
  },
  
  external: {
    spotify: {
      artistId: String,
      followers: Number,
      monthlyListeners: Number,
      topTracks: [mongoose.Schema.Types.Mixed],
      lastSync: Date
    },
    instagram: {
      handle: String,
      followers: Number,
      engagement: Number,
      lastSync: Date
    },
    youtube: {
      channelId: String,
      subscribers: Number,
      totalViews: Number,
      lastSync: Date
    },
    bandcamp: {
      url: String,
      sales: Number,
      fans: Number,
      lastSync: Date
    }
  },
  
  engagement: {
    lastLogin: Date,
    totalLogins: {
      type: Number,
      default: 0
    },
    pdfPurchased: {
      type: Boolean,
      default: false
    },
    pdfPurchasedAt: Date,
    webinarAttended: [Date],
    resourcesAccessed: [String]
  },
  
  tags: [String],
  
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
// Note: email already has unique: true which creates an index
ArtistProfileSchema.index({ 'pathways.primary.type': 1 });
ArtistProfileSchema.index({ 'career.stage': 1 });
ArtistProfileSchema.index({ tags: 1 });
ArtistProfileSchema.index({ createdAt: -1 });

// Virtual for full name
ArtistProfileSchema.virtual('displayName').get(function() {
  return this.profile.stageName || this.profile.name || this.email.split('@')[0];
});

// Method to update pathway scores
ArtistProfileSchema.methods.updatePathwayScores = function(scores, recommendation) {
  // Add to history
  this.pathways.history.push({
    scores,
    recommendation: recommendation.pathway
  });
  
  // Update primary and secondary pathways
  const sortedPaths = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);
  
  if (sortedPaths[0]) {
    this.pathways.primary = {
      type: sortedPaths[0][0],
      score: sortedPaths[0][1],
      level: recommendation.levels[sortedPaths[0][0]],
      focusAreas: recommendation.pathwayDetails?.[sortedPaths[0][0]]?.focusAreas?.split(' • ') || [],
      lastUpdated: new Date()
    };
  }
  
  if (sortedPaths[1] && recommendation.levels[sortedPaths[1][0]] === 'Strategic Secondary') {
    this.pathways.secondary = {
      type: sortedPaths[1][0],
      score: sortedPaths[1][1],
      level: recommendation.levels[sortedPaths[1][0]]
    };
  }
  
  return this.save();
};

// Don't create the model if it already exists (for hot reloading in development)
const ArtistProfile = mongoose.models.ArtistProfile || mongoose.model('ArtistProfile', ArtistProfileSchema);

export default ArtistProfile;