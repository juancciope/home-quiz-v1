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

    // Get all data from different collections
    const [artistProfiles, quizSubmissions] = await Promise.all([
      ArtistProfile.find({}).lean(),
      QuizSubmission.find({}).lean()
    ]);

    // Get contest data from MongoDB directly
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    let contestSubmissions = [];
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('bootcamp_registrations');
      
      contestSubmissions = await collection
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();
    } finally {
      await client.close();
    }

    // Debug information
    const debugInfo = {
      collections: {
        artistProfiles: {
          count: artistProfiles.length,
          emails: artistProfiles.map(p => p.email),
          sample: artistProfiles[0] || null
        },
        quizSubmissions: {
          count: quizSubmissions.length,
          emails: quizSubmissions.map(q => q.email),
          sample: quizSubmissions[0] || null
        },
        contestSubmissions: {
          count: contestSubmissions.length,
          emails: contestSubmissions.map(c => c.email),
          sample: contestSubmissions[0] || null
        }
      },
      emailMatches: {
        contestToArtist: contestSubmissions.map(c => ({
          contestEmail: c.email,
          foundInArtistProfiles: artistProfiles.some(p => p.email === c.email),
          foundInQuizSubmissions: quizSubmissions.some(q => q.email === c.email)
        })),
        uniqueEmails: {
          allEmails: [...new Set([
            ...artistProfiles.map(p => p.email),
            ...quizSubmissions.map(q => q.email),
            ...contestSubmissions.map(c => c.email)
          ])],
          artistOnly: artistProfiles.map(p => p.email).filter(email => 
            !quizSubmissions.some(q => q.email === email) && 
            !contestSubmissions.some(c => c.email === email)
          ),
          quizOnly: quizSubmissions.map(q => q.email).filter(email => 
            !artistProfiles.some(p => p.email === email) && 
            !contestSubmissions.some(c => c.email === email)
          ),
          contestOnly: contestSubmissions.map(c => c.email).filter(email => 
            !artistProfiles.some(p => p.email === email) && 
            !quizSubmissions.some(q => q.email === email)
          )
        }
      }
    };

    res.status(200).json(debugInfo);
  } catch (error) {
    console.error('Error in debug:', error);
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
}