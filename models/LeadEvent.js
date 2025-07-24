import mongoose from 'mongoose';

const LeadEventSchema = new mongoose.Schema({
  artistProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtistProfile',
    required: true
  },
  
  eventType: {
    type: String,
    enum: [
      'quiz_started',
      'quiz_completed',
      'email_captured',
      'pdf_purchased',
      'pdf_downloaded',
      'email_opened',
      'email_clicked',
      'webinar_registered',
      'webinar_attended',
      'resource_accessed',
      'profile_updated',
      'external_data_synced'
    ],
    required: true
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  source: {
    type: String,
    default: 'web'
  },
  
  metadata: {
    ip: String,
    userAgent: String,
    sessionId: String
  }
}, {
  timestamps: true
});

// Indexes for performance
LeadEventSchema.index({ artistProfileId: 1, timestamp: -1 });
LeadEventSchema.index({ eventType: 1, timestamp: -1 });
LeadEventSchema.index({ timestamp: -1 });

// Static method to create common events
LeadEventSchema.statics.createEvent = async function(artistProfileId, eventType, data = {}, metadata = {}) {
  return this.create({
    artistProfileId,
    eventType,
    data,
    metadata,
    timestamp: new Date()
  });
};

const LeadEvent = mongoose.models.LeadEvent || mongoose.model('LeadEvent', LeadEventSchema);

export default LeadEvent;