import dbConnect from '../../lib/mongoose';
import ArtistProfile from '../../models/ArtistProfile';
import QuizSubmission from '../../models/QuizSubmission';
import LeadEvent from '../../models/LeadEvent';
import { isValidEmail } from '../../lib/validation';

export default async function handler(req, res) {
  console.log('📋 UPDATE-SURVEY API CALLED');
  console.log('📋 Method:', req.method);
  console.log('📋 Body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    const { email, surveyResponses } = req.body;
    
    // Basic validation
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
    
    if (!surveyResponses || Object.keys(surveyResponses).length === 0) {
      console.error('❌ No survey responses provided');
      return res.status(400).json({ 
        success: false, 
        message: 'Survey responses are required' 
      });
    }

    console.log('📧 Updating survey data for:', email);
    console.log('📋 Survey responses:', Object.keys(surveyResponses));

    // Find existing artist profile
    const artistProfile = await ArtistProfile.findOne({ email: email.toLowerCase() });
    
    if (!artistProfile) {
      console.error('❌ Artist profile not found for email:', email);
      return res.status(404).json({ 
        success: false, 
        message: 'Artist profile not found. Please complete the quiz first.' 
      });
    }

    console.log('👤 Found artist profile:', artistProfile._id);

    // Update survey insights in artist profile
    console.log('📋 Updating survey insights in artist profile...');
    artistProfile.surveyInsights = {
      primaryChallenges: surveyResponses.challenges || [],
      goals2025: surveyResponses['goals_2025'] || [],
      learningPreference: surveyResponses.learning_preference || '',
      pricingRange: {
        contentCalendar: surveyResponses.service_pricing?.['content-calendar'] || 0,
        dataInsights: surveyResponses.service_pricing?.['data-insights'] || 0,
        collaborationMatching: surveyResponses.service_pricing?.['collaboration-matching'] || 0,
        tourPlanning: surveyResponses.service_pricing?.['tour-planning'] || 0,
        marketingServices: surveyResponses.service_pricing?.['marketing-services'] || 0,
        releaseManagement: surveyResponses.service_pricing?.['release-management'] || 0
      },
      genres: surveyResponses.genres || [],
      skillsOffered: surveyResponses['collaboration-skills'] || [],
      skillsSeeking: surveyResponses['seeking-skills'] || [],
      industryConnections: surveyResponses['industry-connections'] || [],
      gearDiscovery: surveyResponses['gear-discovery'] || [],
      lastUpdated: new Date()
    };
    
    await artistProfile.save();
    console.log('✅ Survey insights updated in artist profile');

    // Update the most recent quiz submission for this user
    const recentSubmission = await QuizSubmission.findOne({ 
      artistProfileId: artistProfile._id 
    }).sort({ submittedAt: -1 });

    if (recentSubmission) {
      console.log('📝 Updating recent quiz submission with survey data...');
      recentSubmission.surveyResponses = surveyResponses;
      await recentSubmission.save();
      console.log('✅ Quiz submission updated with survey data');
    } else {
      console.warn('⚠️ No recent quiz submission found to update');
    }

    // Create survey completion event
    await LeadEvent.createEvent(
      artistProfile._id,
      'quiz_completed', // Using same event type but will have survey data
      {
        surveyCompleted: true,
        surveyQuestions: Object.keys(surveyResponses).length,
        primaryChallenges: surveyResponses.challenges,
        genres: surveyResponses.genres
      },
      {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    );

    console.log('✅ Survey update complete');

    // Return success
    res.status(200).json({ 
      success: true,
      message: 'Survey responses updated successfully',
      email: email,
      surveyQuestions: Object.keys(surveyResponses).length
    });
    
  } catch (error) {
    console.error('❌ Update survey error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update survey responses',
      error: error.message 
    });
  }
}