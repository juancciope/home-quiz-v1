import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token provided');
  
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.verify(token, jwtSecret);
};

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    verifyToken(req);

    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);

    if (req.method === 'GET') {
      // GET: Check for recovery options
      console.log('🔍 Checking for contest data recovery options...');
      
      try {
        await client.connect();
        const db = client.db();
        
        // Check for backup collections or versioned data
        const collections = await db.listCollections().toArray();
        const backupCollections = collections.filter(c => 
          c.name.includes('backup') || 
          c.name.includes('history') || 
          c.name.includes('archive') ||
          c.name.includes('bootcamp')
        );

        // Check current contest data
        const contestCollection = db.collection('bootcamp_registrations');
        const currentContests = await contestCollection.find({}).toArray();
        
        // Check for any MongoDB change streams or oplog (if available)
        let hasOplog = false;
        try {
          const oplogCollection = db.collection('oplog.rs');
          const oplogCount = await oplogCollection.countDocuments();
          hasOplog = oplogCount > 0;
        } catch (e) {
          // Oplog might not be accessible
        }

        const recoveryInfo = {
          timestamp: new Date().toISOString(),
          currentContestEntries: currentContests.length,
          availableCollections: collections.map(c => c.name),
          backupCollections: backupCollections.map(c => c.name),
          hasOplog: hasOplog,
          currentContests: currentContests.map(c => ({
            _id: c._id,
            email: c.email,
            submittedAt: c.submittedAt,
            techIdea: c.techIdea?.substring(0, 50) + '...'
          })),
          recoveryOptions: [
            'Manual entry restoration (if you have the original data)',
            'MongoDB Atlas backup restoration (if using Atlas)',
            'File system backup restoration (if self-hosted)',
            'Manual contest entry creation'
          ]
        };

        res.status(200).json(recoveryInfo);
        
      } finally {
        await client.close();
      }
    } 
    
    else if (req.method === 'POST') {
      // POST: Manual contest entry insertion
      console.log('📝 Manual contest entry insertion...');
      
      const { email, techIdea, techBackground, submittedAt } = req.body;
      
      if (!email || !techIdea) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and tech idea are required' 
        });
      }

      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('bootcamp_registrations');
        
        // Create new contest entry
        const newEntry = {
          email: email.toLowerCase().trim(),
          techIdea: techIdea.trim(),
          techBackground: techBackground || 'not specified',
          submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
          status: 'pending_review',
          source: 'manual_recovery',
          recoveredAt: new Date(),
          recoveredBy: 'admin'
        };
        
        // Check if this email already exists
        const existing = await collection.findOne({ email: newEntry.email });
        if (existing) {
          return res.status(409).json({
            success: false,
            message: 'Entry with this email already exists',
            existingEntry: {
              _id: existing._id,
              email: existing.email,
              submittedAt: existing.submittedAt,
              techIdea: existing.techIdea?.substring(0, 50) + '...'
            }
          });
        }
        
        // Insert the new entry
        const result = await collection.insertOne(newEntry);
        
        console.log('✅ Manual contest entry created:', result.insertedId);
        
        res.status(200).json({
          success: true,
          message: 'Contest entry recovered successfully',
          insertedId: result.insertedId,
          entry: newEntry
        });
        
      } finally {
        await client.close();
      }
    }

  } catch (error) {
    console.error('❌ Recovery error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Recovery operation failed',
      error: error.message 
    });
  }
}