import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongoose';

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

    // Access MongoDB directly for contest submissions
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('bootcamp_registrations'); // This should be renamed to contest_registrations
      
      const contestSubmissions = await collection
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();

      // Format the data
      const formattedData = contestSubmissions.map(submission => ({
        email: submission.email,
        techIdea: submission.techIdea,
        techBackground: submission.techBackground,
        status: submission.status,
        submittedAt: submission.submittedAt,
        updatedAt: submission.updatedAt
      }));

      res.status(200).json(formattedData);
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error fetching contest submissions:', error);
    res.status(401).json({ message: 'Unauthorized or error fetching data' });
  }
}