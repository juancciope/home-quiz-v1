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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    verifyToken(req);

    console.log('🔄 Starting migration rollback...');

    // Connect to MongoDB
    await dbConnect();

    const rollbackResults = {
      artistProfilesProcessed: 0,
      contestEntriesProcessed: 0,
      migratedTagsRemoved: 0,
      artistProfileIdsCleared: 0,
      migratedAtFieldsRemoved: 0,
      errors: 0,
      details: []
    };

    // Get contest data from MongoDB directly
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('bootcamp_registrations');
      
      // Step 1: Clear artistProfileId and migratedAt from all contest entries
      console.log('🧹 Clearing migration fields from contest entries...');
      const contestUpdateResult = await collection.updateMany(
        {}, // All documents
        { 
          $unset: { 
            artistProfileId: "",
            migratedAt: ""
          }
        }
      );
      
      rollbackResults.contestEntriesProcessed = contestUpdateResult.modifiedCount;
      rollbackResults.artistProfileIdsCleared = contestUpdateResult.modifiedCount;
      rollbackResults.migratedAtFieldsRemoved = contestUpdateResult.modifiedCount;
      
      console.log(`✅ Cleared migration fields from ${contestUpdateResult.modifiedCount} contest entries`);
      
      // Get all contest emails for step 2
      const contestSubmissions = await collection.find({}).toArray();
      const contestEmails = [...new Set(contestSubmissions.map(c => c.email.toLowerCase()))];
      
    } finally {
      await client.close();
    }

    // Step 2: Remove 'migrated' and 'contest-registered' tags from artist profiles
    console.log('🏷️ Removing migration tags from artist profiles...');
    
    const artistProfiles = await ArtistProfile.find({
      $or: [
        { tags: 'migrated' },
        { tags: 'contest-registered' }
      ]
    });

    rollbackResults.artistProfilesProcessed = artistProfiles.length;

    for (const profile of artistProfiles) {
      try {
        const originalTags = [...profile.tags];
        
        // Remove migration-related tags
        profile.tags = profile.tags.filter(tag => 
          tag !== 'migrated' && tag !== 'contest-registered'
        );
        
        // Only save if tags actually changed
        if (profile.tags.length !== originalTags.length) {
          await profile.save();
          rollbackResults.migratedTagsRemoved++;
          
          rollbackResults.details.push({
            email: profile.email,
            action: 'tags_removed',
            removedTags: originalTags.filter(tag => !profile.tags.includes(tag)),
            status: 'success'
          });
        }
        
      } catch (error) {
        rollbackResults.errors++;
        console.error(`❌ Error processing profile ${profile.email}:`, error);
        
        rollbackResults.details.push({
          email: profile.email,
          action: 'error',
          error: error.message,
          status: 'error'
        });
      }
    }

    // Step 3: Optional - Remove artist profiles that were ONLY created for contest migration
    // (profiles that have ONLY 'migrated' tag and no quiz data)
    console.log('🗑️ Identifying contest-only profiles created by migration...');
    
    const contestOnlyProfiles = await ArtistProfile.find({
      tags: { $in: ['migrated'] },
      'pathways.primary': { $exists: false }, // No quiz data
      name: { $in: ['', null] } // No name set
    });

    if (contestOnlyProfiles.length > 0) {
      console.log(`⚠️ Found ${contestOnlyProfiles.length} contest-only profiles that could be removed`);
      // Note: Not automatically deleting these - just reporting for manual review
      
      rollbackResults.details.push({
        action: 'contest_only_profiles_found',
        count: contestOnlyProfiles.length,
        emails: contestOnlyProfiles.map(p => p.email),
        status: 'info',
        note: 'These profiles were likely created only for contest migration and could be safely removed'
      });
    }

    console.log('🎉 Rollback completed!');
    console.log(`📊 Results: ${rollbackResults.artistProfilesProcessed} profiles processed, ${rollbackResults.migratedTagsRemoved} tags removed, ${rollbackResults.contestEntriesProcessed} contest entries cleared`);

    res.status(200).json({
      success: true,
      message: 'Migration rollback completed',
      results: rollbackResults
    });

  } catch (error) {
    console.error('❌ Rollback error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Rollback failed',
      error: error.message 
    });
  }
}