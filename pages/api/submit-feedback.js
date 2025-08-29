import mongoose from 'mongoose';
import Feedback from '../../models/Feedback';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for feedback submission');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      artistName, 
      feedback, 
      pathway, 
      sessionId 
    } = req.body;

    // Validate required fields
    if (!email || !feedback) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and feedback are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }

    // Validate feedback length
    if (feedback.length < 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Feedback must be at least 10 characters' 
      });
    }

    if (feedback.length > 5000) {
      return res.status(400).json({ 
        success: false,
        message: 'Feedback must be less than 5000 characters' 
      });
    }

    console.log('📝 Feedback submission received:', {
      email,
      artistName,
      feedbackLength: feedback.length,
      pathway,
      sessionId
    });

    // Connect to MongoDB
    await connectDB();

    // Get user IP and user agent
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    // Create feedback document
    const feedbackDoc = new Feedback({
      email,
      artistName: artistName || '',
      feedback,
      pathway: pathway || null,
      sessionId: sessionId || null,
      source: {
        page: 'execute',
        userAgent,
        ip
      }
    });

    // Save to database
    await feedbackDoc.save();

    console.log('✅ Feedback saved to MongoDB:', feedbackDoc._id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback! We really appreciate it.',
      feedbackId: feedbackDoc._id
    });

  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    // Check if it's a MongoDB validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback data',
        details: error.message
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}