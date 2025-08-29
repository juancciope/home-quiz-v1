import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  artistName: {
    type: String,
    trim: true
  },
  
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  
  pathway: {
    type: String,
    enum: ['touring-performer', 'creative-artist', 'writer-producer']
  },
  
  sessionId: String,
  
  source: {
    page: {
      type: String,
      default: 'execute'
    },
    userAgent: String,
    ip: String
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
FeedbackSchema.index({ email: 1 });
FeedbackSchema.index({ submittedAt: -1 });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export default Feedback;