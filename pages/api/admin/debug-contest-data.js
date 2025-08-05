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

    console.log('🔍 DEBUG: Investigating contest data corruption...');

    // Connect to MongoDB
    await dbConnect();

    // Get contest data from MongoDB directly
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    let contestSubmissions = [];
    let allCollections = [];
    
    try {
      await client.connect();
      const db = client.db();
      
      // Get contest data with full details
      const collection = db.collection('bootcamp_registrations');
      contestSubmissions = await collection
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();
      
      // Get all collection names to see what exists
      allCollections = await db.listCollections().toArray();
      
    } finally {
      await client.close();
    }

    // Get artist profiles
    const artistProfiles = await ArtistProfile.find({}).lean();

    // Debug information
    const debugInfo = {
      timestamp: new Date().toISOString(),
      collections: {
        available: allCollections.map(c => c.name),
        contestSubmissions: {
          count: contestSubmissions.length,
          entries: contestSubmissions.map(entry => ({
            _id: entry._id,
            email: entry.email,
            submittedAt: entry.submittedAt,
            artistProfileId: entry.artistProfileId,
            migratedAt: entry.migratedAt,
            techIdea: entry.techIdea?.substring(0, 50) + '...',
            techBackground: entry.techBackground
          }))
        },
        artistProfiles: {
          count: artistProfiles.length,
          contestTagged: artistProfiles.filter(p => p.tags?.includes('contest-registered')).map(p => ({
            _id: p._id,
            email: p.email,
            tags: p.tags,
            createdAt: p.createdAt
          }))
        }
      },
      potentialIssues: {
        duplicateEmails: contestSubmissions.reduce((acc, entry) => {
          const email = entry.email;
          if (!acc[email]) acc[email] = [];
          acc[email].push({
            _id: entry._id,
            submittedAt: entry.submittedAt,
            artistProfileId: entry.artistProfileId
          });
          return acc;
        }, {}),
        orphanedEntries: contestSubmissions.filter(entry => !entry.artistProfileId),
        wronglyLinked: contestSubmissions.filter(entry => {
          if (!entry.artistProfileId) return false;
          const linkedProfile = artistProfiles.find(p => p._id.toString() === entry.artistProfileId.toString());
          return linkedProfile && linkedProfile.email !== entry.email;
        })
      }
    };

    console.log('🔍 Contest data debug complete');
    console.log('📊 Found issues:', {
      orphaned: debugInfo.potentialIssues.orphanedEntries.length,
      wronglyLinked: debugInfo.potentialIssues.wronglyLinked.length
    });

    res.status(200).json(debugInfo);
  } catch (error) {
    console.error('Error in contest debug:', error);
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
}