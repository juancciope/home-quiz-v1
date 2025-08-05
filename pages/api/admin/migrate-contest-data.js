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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    verifyToken(req);

    console.log('🔧 Starting contest data migration...');

    // Connect to MongoDB
    await dbConnect();

    // Get all existing data
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
      
      contestSubmissions = await collection.find({}).toArray();
    } finally {
      await client.close();
    }

    console.log(`📊 Found ${contestSubmissions.length} contest submissions`);
    console.log(`👤 Found ${artistProfiles.length} artist profiles`);
    console.log(`📝 Found ${quizSubmissions.length} quiz submissions`);

    const migrationResults = {
      processed: 0,
      created: 0,
      linked: 0,
      errors: 0,
      details: []
    };

    // Process each contest submission
    for (const contest of contestSubmissions) {
      try {
        migrationResults.processed++;
        const email = contest.email.toLowerCase();
        
        console.log(`🔍 Processing contest entry for: ${email}`);

        // Check if artist profile already exists
        let artistProfile = await ArtistProfile.findOne({ email });
        
        if (!artistProfile) {
          // Try to find matching quiz submission to get more data
          const quizSubmission = quizSubmissions.find(q => q.email === email);
          
          if (quizSubmission) {
            console.log(`📝 Found matching quiz submission for ${email}`);
            // Create artist profile based on quiz data
            artistProfile = new ArtistProfile({
              email: email,
              name: quizSubmission.artistName || '',
              career: {
                stage: quizSubmission.responses?.stageLevel || 'planning',
                startedAt: quizSubmission.submittedAt || contest.submittedAt
              },
              tags: ['quiz-completed', 'contest-registered', 'migrated'],
              createdAt: quizSubmission.submittedAt || contest.submittedAt
            });
          } else {
            console.log(`🆕 Creating new artist profile for contest-only user: ${email}`);
            // Create minimal artist profile for contest-only user
            artistProfile = new ArtistProfile({
              email: email,
              name: '', // No name available from contest data
              career: {
                stage: 'planning', // Default stage
                startedAt: contest.submittedAt
              },
              tags: ['contest-registered', 'migrated'],
              createdAt: contest.submittedAt
            });
          }
          
          await artistProfile.save();
          migrationResults.created++;
          console.log(`✅ Created artist profile for ${email}`);
        } else {
          console.log(`👤 Found existing artist profile for ${email}`);
          // Add contest tag if not already present
          if (!artistProfile.tags.includes('contest-registered')) {
            artistProfile.tags.push('contest-registered');
            await artistProfile.save();
          }
        }

        // Update contest submission to link to artist profile (if not already linked)
        if (!contest.artistProfileId) {
          console.log(`🔗 Linking contest submission to artist profile...`);
          
          const client2 = new MongoClient(process.env.MONGODB_URI);
          try {
            await client2.connect();
            const db = client2.db();
            const collection = db.collection('bootcamp_registrations');
            
            await collection.updateOne(
              { _id: contest._id },
              { 
                $set: { 
                  artistProfileId: artistProfile._id,
                  migratedAt: new Date()
                }
              }
            );
            
            migrationResults.linked++;
            console.log(`🔗 Linked contest submission to artist profile for ${email}`);
          } finally {
            await client2.close();
          }
        }

        migrationResults.details.push({
          email: email,
          status: 'success',
          action: artistProfile ? 'linked' : 'created_and_linked',
          contestId: contest._id,
          profileId: artistProfile._id
        });

      } catch (error) {
        migrationResults.errors++;
        console.error(`❌ Error processing ${contest.email}:`, error);
        
        migrationResults.details.push({
          email: contest.email,
          status: 'error',
          error: error.message,
          contestId: contest._id
        });
      }
    }

    console.log('🎉 Migration completed!');
    console.log(`📊 Results: ${migrationResults.created} created, ${migrationResults.linked} linked, ${migrationResults.errors} errors`);

    res.status(200).json({
      success: true,
      message: 'Contest data migration completed',
      results: migrationResults
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Migration failed',
      error: error.message 
    });
  }
}