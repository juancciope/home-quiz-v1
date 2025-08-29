import mongoose from 'mongoose';
import Feedback from '../../../models/Feedback';

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
    console.log('MongoDB connected for admin feedbacks');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Get query parameters for filtering
    const { 
      page = 1, 
      limit = 50, 
      sortBy = 'submittedAt', 
      order = 'desc',
      email,
      pathway
    } = req.query;

    // Build filter
    const filter = {};
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }
    if (pathway) {
      filter.pathway = pathway;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    // Get total count
    const total = await Feedback.countDocuments(filter);

    // Get feedbacks with pagination
    const feedbacks = await Feedback.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format response
    const response = {
      success: true,
      data: feedbacks.map(feedback => ({
        id: feedback._id,
        email: feedback.email,
        artistName: feedback.artistName,
        feedback: feedback.feedback,
        pathway: feedback.pathway,
        sessionId: feedback.sessionId,
        submittedAt: feedback.submittedAt,
        createdAt: feedback.createdAt
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}