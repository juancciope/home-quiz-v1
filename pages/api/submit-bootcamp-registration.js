import dbConnect from '../../lib/mongoose';
import { isValidEmail } from '../../lib/validation';

export default async function handler(req, res) {
  console.log('🚀 BOOTCAMP REGISTRATION API CALLED');
  console.log('📋 Method:', req.method);
  console.log('📋 Body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    const { email, techIdea, techBackground } = req.body;
    
    // Validation
    if (!email) {
      console.error('❌ No email provided');
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    if (!isValidEmail(email)) {
      console.error('❌ Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    if (!techIdea || techIdea.trim().length < 10) {
      console.error('❌ Tech idea too short or missing');
      return res.status(400).json({ 
        success: false, 
        message: 'Please describe your tech idea (at least 10 characters)' 
      });
    }

    console.log('🚀 Processing bootcamp registration for:', email);
    console.log('💡 Tech Idea:', techIdea.substring(0, 100) + '...');
    console.log('👨‍💻 Background:', techBackground);

    // Store in MongoDB - we'll create a simple collection for now
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('bootcamp_registrations');
      
      const registration = {
        email: email.toLowerCase().trim(),
        techIdea: techIdea.trim(),
        techBackground: techBackground || 'not specified',
        submittedAt: new Date(),
        status: 'pending_review',
        source: 'music-creator-roadmap-quiz'
      };
      
      // Check if email already exists
      const existing = await collection.findOne({ email: registration.email });
      if (existing) {
        console.log('📧 Email already registered, updating existing registration');
        await collection.updateOne(
          { email: registration.email },
          { 
            $set: {
              techIdea: registration.techIdea,
              techBackground: registration.techBackground,
              updatedAt: new Date()
            }
          }
        );
      } else {
        console.log('📧 Creating new bootcamp registration');
        await collection.insertOne(registration);
      }
      
    } finally {
      await client.close();
    }

    console.log('✅ Bootcamp registration stored successfully');

    // Return success
    res.status(200).json({ 
      success: true,
      message: 'Bootcamp registration submitted successfully',
      email: email
    });
    
  } catch (error) {
    console.error('❌ Bootcamp registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit registration',
      error: error.message 
    });
  }
}