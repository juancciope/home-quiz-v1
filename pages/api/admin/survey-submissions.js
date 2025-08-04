import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongoose';
import ArtistProfile from '../../../models/ArtistProfile';

// Middleware to verify JWT token
const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token provided');
  
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.verify(token, jwtSecret);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    verifyToken(req);

    // Connect to MongoDB
    await dbConnect();

    // Fetch artist profiles that have survey insights
    const artistProfiles = await ArtistProfile.find({
      'surveyInsights': { $exists: true, $ne: null }
    }).sort({ updatedAt: -1 }).lean();

    // Format survey data
    const surveyData = artistProfiles.map(profile => ({
      email: profile.email,
      name: profile.name,
      nps: profile.surveyInsights?.nps,
      ces: profile.surveyInsights?.ces,
      feedback: profile.surveyInsights?.feedback,
      monthlyInvestment: profile.surveyInsights?.monthlyInvestment,
      createdAt: profile.updatedAt || profile.createdAt
    })).filter(item => 
      // Only include profiles with actual survey data
      item.nps !== undefined || item.ces !== undefined || item.feedback
    );

    res.status(200).json(surveyData);
  } catch (error) {
    console.error('Error fetching survey submissions:', error);
    res.status(401).json({ message: 'Unauthorized or error fetching data' });
  }
}