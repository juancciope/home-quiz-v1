import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongoose';
import ArtistProfile from '../../../models/ArtistProfile';
import QuizSubmission from '../../../models/QuizSubmission';

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

    // Fetch quiz submissions from both collections
    const [artistProfiles, quizSubmissions] = await Promise.all([
      ArtistProfile.find({}).sort({ createdAt: -1 }).lean(),
      QuizSubmission.find({}).sort({ submittedAt: -1 }).lean()
    ]);

    // Combine and format data
    const combinedData = [];

    // Add artist profiles
    artistProfiles.forEach(profile => {
      combinedData.push({
        email: profile.email,
        name: profile.name,
        pathway: profile.currentPathway?.pathway || profile.pathwayScores?.[0]?.pathway,
        stage: profile.career?.stage,
        createdAt: profile.createdAt,
        source: 'artist_profile'
      });
    });

    // Add quiz submissions
    quizSubmissions.forEach(submission => {
      combinedData.push({
        email: submission.email,
        name: submission.artistName,
        pathway: submission.pathway,
        stage: submission.responses?.['stage-level'],
        createdAt: submission.submittedAt,
        source: 'quiz_submission'
      });
    });

    // Sort by date (newest first)
    combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    res.status(401).json({ message: 'Unauthorized or error fetching data' });
  }
}