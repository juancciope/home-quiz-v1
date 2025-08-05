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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    verifyToken(req);

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Connect to MongoDB
    await dbConnect();

    console.log(`🗑️ Deleting contact: ${email}`);

    // Delete from all relevant collections
    const deleteResults = await Promise.allSettled([
      // Delete from ArtistProfile
      ArtistProfile.deleteOne({ email: email.toLowerCase() }),
      
      // Delete from QuizSubmission
      QuizSubmission.deleteOne({ email: email.toLowerCase() }),
      
      // Delete from contest submissions (MongoDB direct access)
      (async () => {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
          await client.connect();
          const db = client.db();
          const collection = db.collection('bootcamp_registrations');
          return await collection.deleteOne({ email: email.toLowerCase() });
        } finally {
          await client.close();
        }
      })()
    ]);

    // Log results
    console.log('Delete results:', deleteResults.map((result, index) => ({
      collection: ['ArtistProfile', 'QuizSubmission', 'ContestSubmissions'][index],
      status: result.status,
      deletedCount: result.status === 'fulfilled' ? result.value.deletedCount : 0,
      error: result.status === 'rejected' ? result.reason.message : null
    })));

    // Calculate total deletions
    const totalDeleted = deleteResults.reduce((acc, result) => {
      if (result.status === 'fulfilled' && result.value.deletedCount) {
        return acc + result.value.deletedCount;
      }
      return acc;
    }, 0);

    if (totalDeleted > 0) {
      console.log(`✅ Successfully deleted ${totalDeleted} records for ${email}`);
      res.status(200).json({ 
        message: 'Contact deleted successfully',
        email,
        deletedRecords: totalDeleted
      });
    } else {
      console.log(`⚠️ No records found for ${email}`);
      res.status(404).json({ 
        message: 'Contact not found',
        email
      });
    }

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ 
      message: 'Error deleting contact',
      error: error.message 
    });
  }
}