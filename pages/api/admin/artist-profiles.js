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

    // Fetch all data sources
    const [artistProfiles, quizSubmissions] = await Promise.all([
      ArtistProfile.find({}).sort({ createdAt: -1 }).lean(),
      QuizSubmission.find({}).sort({ submittedAt: -1 }).lean()
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

    // Create comprehensive artist profiles
    const profiles = new Map();

    // Add artist profiles as base
    artistProfiles.forEach(profile => {
      profiles.set(profile.email, {
        email: profile.email,
        name: profile.profile?.name || profile.name,
        stageName: profile.profile?.stageName,
        lastActivity: profile.updatedAt || profile.createdAt,
        
        // Quiz data
        quiz: {
          pathway: profile.pathways?.primary?.type || profile.currentPathway?.pathway,
          stage: profile.career?.stage,
          pathwayScore: profile.pathways?.primary?.score,
          focusAreas: profile.pathways?.primary?.focusAreas || [],
          completedAt: profile.pathways?.primary?.lastUpdated || profile.createdAt,
          responses: profile.responses || null
        },
        
        // Survey data
        survey: profile.surveyInsights ? {
          nps: profile.surveyInsights.nps,
          ces: profile.surveyInsights.ces,
          feedback: profile.surveyInsights.feedback,
          primaryChallenges: profile.surveyInsights.primaryChallenges || [],
          careerStage: profile.surveyInsights.careerStage,
          monthlyInvestment: profile.surveyInsights.monthlyInvestment,
          careerImpact: profile.surveyInsights.careerImpact,
          recordingSoftware: profile.surveyInsights.recordingSoftware || [],
          gearPurchases: profile.surveyInsights.gearPurchases || [],
          softwareSubscriptions: profile.surveyInsights.softwareSubscriptions || [],
          valuableTools: profile.surveyInsights.valuableTools || [],
          educationalFormat: profile.surveyInsights.educationalFormat || [],
          pricingRange: profile.surveyInsights.pricingRange || {},
          genres: profile.surveyInsights.genres || [],
          skillsOffered: profile.surveyInsights.skillsOffered || [],
          skillsSeeking: profile.surveyInsights.skillsSeeking || [],
          industryConnections: profile.surveyInsights.industryConnections || [],
          gearDiscovery: profile.surveyInsights.gearDiscovery || [],
          completedAt: profile.surveyInsights.lastUpdated
        } : null,
        
        // Contest data (will be filled from contest submissions)
        contest: null,
        
        // Profile data
        profile: {
          location: profile.profile?.location,
          genres: profile.profile?.genres || [],
          instruments: profile.profile?.instruments || [],
          roles: profile.profile?.roles || []
        },
        
        // Engagement data
        engagement: {
          totalLogins: profile.engagement?.totalLogins || 0,
          lastLogin: profile.engagement?.lastLogin,
          pdfPurchased: profile.engagement?.pdfPurchased || false,
          pdfPurchasedAt: profile.engagement?.pdfPurchasedAt,
          resourcesAccessed: profile.engagement?.resourcesAccessed || []
        },
        
        tags: profile.tags || [],
        createdAt: profile.createdAt
      });
    });

    // Add quiz submissions for profiles not in ArtistProfile collection
    quizSubmissions.forEach(submission => {
      if (!profiles.has(submission.email)) {
        profiles.set(submission.email, {
          email: submission.email,
          name: submission.artistName,
          stageName: null,
          lastActivity: submission.submittedAt,
          
          quiz: {
            pathway: submission.pathway,
            stage: submission.responses?.['stage-level'],
            pathwayScore: null,
            focusAreas: [],
            completedAt: submission.submittedAt,
            responses: submission.responses
          },
          
          survey: null,
          contest: null,
          profile: { location: null, genres: [], instruments: [], roles: [] },
          engagement: { totalLogins: 0, lastLogin: null, pdfPurchased: false, resourcesAccessed: [] },
          tags: [],
          createdAt: submission.submittedAt
        });
      }
    });

    // Add contest submissions
    contestSubmissions.forEach(submission => {
      if (profiles.has(submission.email)) {
        profiles.get(submission.email).contest = {
          techIdea: submission.techIdea,
          techBackground: submission.techBackground,
          status: submission.status,
          submittedAt: submission.submittedAt
        };
      } else {
        // Create new profile for contest-only submissions
        profiles.set(submission.email, {
          email: submission.email,
          name: null,
          stageName: null,
          lastActivity: submission.submittedAt,
          
          quiz: null,
          survey: null,
          contest: {
            techIdea: submission.techIdea,
            techBackground: submission.techBackground,
            status: submission.status,
            submittedAt: submission.submittedAt
          },
          
          profile: { location: null, genres: [], instruments: [], roles: [] },
          engagement: { totalLogins: 0, lastLogin: null, pdfPurchased: false, resourcesAccessed: [] },
          tags: [],
          createdAt: submission.submittedAt
        });
      }
    });

    // Convert to array and sort by last activity
    const profilesArray = Array.from(profiles.values()).sort((a, b) => 
      new Date(b.lastActivity) - new Date(a.lastActivity)
    );

    res.status(200).json(profilesArray);
  } catch (error) {
    console.error('Error fetching artist profiles:', error);
    res.status(401).json({ message: 'Unauthorized or error fetching data' });
  }
}