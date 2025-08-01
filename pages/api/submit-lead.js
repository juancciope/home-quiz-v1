import dbConnect from '../../lib/mongoose';
import ArtistProfile from '../../models/ArtistProfile';
import QuizSubmission from '../../models/QuizSubmission';
import LeadEvent from '../../models/LeadEvent';
import { isValidEmail, validateQuizResponses, sanitizeInput } from '../../lib/validation';
import { enrollInBeehiveAutomation } from '../../lib/beehive';

// Main handler function
export default async function handler(req, res) {
  console.log('🔔 SUBMIT-LEAD API CALLED');
  console.log('🔔 Method:', req.method);
  console.log('🔔 Body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    const { email, artistName, pathway, responses, source, results, surveyResponses } = req.body;
    
    // Enhanced validation
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
    
    // Validate quiz responses
    const validationErrors = validateQuizResponses(responses);
    if (validationErrors.length > 0) {
      console.error('❌ Validation errors:', validationErrors);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid quiz responses',
        errors: validationErrors
      });
    }

    console.log('📧 Processing lead for:', email);
    console.log('🎯 Pathway:', pathway);
    console.log('📝 Responses:', responses);
    console.log('📊 Results:', results);
    console.log('📋 Survey Responses:', surveyResponses ? 'Present' : 'Not provided');

    // Extract scoring data if available
    const scoreResult = results?.scoreResult || {};
    const pathwayDetails = results?.pathwayDetails || {};
    
    // Determine primary path - try multiple sources
    const primaryPath = scoreResult?.recommendation?.path || 
                       results?.pathway || 
                       pathway || 
                       'touring-performer'; // fallback
    
    const levels = scoreResult?.levels || {};
    
    // Determine pathway names and keys
    const pathwayNames = {
      'touring-performer': 'Performer',
      'creative-artist': 'Creative', 
      'writer-producer': 'Producer'
    };
    
    // Handle case where we might get a title instead of a key
    const pathwayKeyMap = {
      'The Touring Performer Path': 'touring-performer',
      'The Creative Artist Path': 'creative-artist',
      'The Writer-Producer Path': 'writer-producer',
      'touring-performer': 'touring-performer',
      'creative-artist': 'creative-artist',
      'writer-producer': 'writer-producer'
    };
    
    // Convert primaryPath to key if it's a title
    const primaryPathKey = pathwayKeyMap[primaryPath] || primaryPath;
    
    // Generate dynamic description using same logic as app/PDF
    const generateDynamicDescription = () => {
      if (!scoreResult?.levels || !scoreResult?.displayPct) {
        return results?.description || '';
      }
      
      // Sort paths by display percentage to match app logic
      const sortedPaths = Object.entries(scoreResult.displayPct)
        .sort((a, b) => b[1] - a[1])
        .map(([path, percentage]) => ({
          path,
          percentage,
          level: scoreResult.levels[path] || 'Noise'
        }));
      
      const primary = sortedPaths[0];
      const secondary = sortedPaths[1];
      const stage = responses?.['stage-level'] || 'planning';
      
      if (primary?.level === 'Core Focus' && secondary?.level === 'Strategic Secondary') {
        return `Your ${pathwayNames[primary.path]} strength should lead your strategy, with your ${pathwayNames[secondary.path]} skills as strategic support. This balance creates the fastest path to your vision.`;
      } else if (primary?.level === 'Core Focus') {
        return `Your ${pathwayNames[primary.path]} strength is your clear advantage. This is where you naturally excel and should invest most of your energy for ${stage} stage success.`;
      } else {
        return `Your ${pathwayNames[primary.path]} path shows the strongest potential. Start here to build clarity and momentum in your music career.`;
      }
    };


    // Store in MongoDB
    try {
      console.log('💾 Storing data in MongoDB...');
      
      // Find or create artist profile
      let artistProfile = await ArtistProfile.findOne({ email: email.toLowerCase() });
      
      if (!artistProfile) {
        console.log('👤 Creating new artist profile...');
        artistProfile = new ArtistProfile({
          email: email.toLowerCase(),
          name: artistName || '',
          career: {
            stage: responses?.['stage-level'] || 'planning',
            startedAt: new Date()
          },
          tags: ['quiz-completed']
        });
      } else {
        // Update name if provided and not already set
        if (artistName && !artistProfile.name) {
          console.log('👤 Updating artist name...');
          artistProfile.name = artistName;
        }
      }
      
      // Update pathway scores
      const fuzzyScores = results?.fuzzyScores || scoreResult?.absPct || {};
      const recommendation = {
        pathway: primaryPathKey,
        levels: levels,
        pathwayDetails: pathwayDetails
      };
      
      await artistProfile.updatePathwayScores(fuzzyScores, recommendation);
      
      // Update survey insights if survey data is provided
      if (surveyResponses && Object.keys(surveyResponses).length > 0) {
        console.log('📋 Updating survey insights in artist profile...');
        artistProfile.surveyInsights = {
          nps: surveyResponses.nps || null,
          ces: surveyResponses.ces || null,
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
          feedback: surveyResponses.feedback || '',
          lastUpdated: new Date()
        };
        await artistProfile.save();
        console.log('✅ Survey insights updated in artist profile');
      }
      
      // Create quiz submission record
      const quizSubmission = new QuizSubmission({
        artistProfileId: artistProfile._id,
        email: email.toLowerCase(),
        responses: {
          motivation: responses?.motivation || '',
          idealDay: responses?.['ideal-day'] || '',
          successVision: responses?.['success-vision'] || '',
          stageLevel: responses?.['stage-level'] || 'planning',
          successDefinition: responses?.['success-definition'] || '',
          resourcesPriority: responses?.['resources-priority'] || ''
        },
        results: {
          fuzzyScores: fuzzyScores,
          recommendation: {
            pathway: primaryPathKey,
            description: results?.description || generateDynamicDescription(),
            nextSteps: (results?.nextSteps || []).map((step, index) => {
              if (typeof step === 'string') {
                return { priority: index + 1, step: step, detail: '' };
              }
              return step;
            }),
            resources: results?.resources || [],
            companies: results?.recommendedCompanies || []
          },
          pathwayDetails: pathwayDetails,
          aiGenerated: results?.assistantUsed || false,
          scoreResult: scoreResult
        },
        surveyResponses: surveyResponses || {},
        source: {
          utm_source: req.query.utm_source || '',
          utm_medium: req.query.utm_medium || '',
          utm_campaign: req.query.utm_campaign || '',
          referrer: req.headers.referer || '',
          userAgent: req.headers['user-agent'] || ''
        }
      });
      
      await quizSubmission.save();
      console.log('✅ Quiz submission saved:', quizSubmission._id);
      
      // Create lead event
      await LeadEvent.createEvent(
        artistProfile._id,
        'quiz_completed',
        {
          pathway: primaryPathKey,
          scores: fuzzyScores,
          stageLevel: responses?.['stage-level']
        },
        {
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          sessionId: req.cookies?.sessionId
        }
      );
      
      console.log('✅ Lead event created');
      console.log('✅ MongoDB storage complete');
      
      // Enroll in Beehive automation sequence
      try {
        console.log('🐝 Enrolling user in Beehive automation...');
        
        const userProfile = {
          pathway: pathwayNames[primaryPathKey] || 'Unknown',
          stage: responses?.['stage-level'] || 'planning',
          primaryFocus: levels[primaryPathKey] === 'Core Focus' ? 'Core' : 'Recommended',
          utm_source: source || 'music-creator-roadmap-quiz',
          utm_medium: 'organic',
          utm_campaign: 'creator-roadmap',
          referring_site: req.headers.referer || 'homeformusic.app'
        };
        
        const beehiveResult = await enrollInBeehiveAutomation(email, userProfile);
        
        if (beehiveResult.success) {
          console.log(`✅ Beehive enrollment successful (${beehiveResult.method})`);
        } else {
          console.warn(`⚠️ Beehive enrollment failed: ${beehiveResult.reason}`);
        }
        
      } catch (beehiveError) {
        console.error('❌ Beehive enrollment error:', beehiveError);
        // Don't fail the entire request if Beehive fails
      }
      
    } catch (dbError) {
      console.error('❌ MongoDB storage error:', dbError);
      // Fail the request if DB storage fails since that's our primary storage now
      throw dbError;
    }


    // Return success to the frontend
    res.status(200).json({ 
      success: true,
      message: 'Lead processed successfully',
      email: email
    });
    
  } catch (error) {
    console.error('❌ Submit lead error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process lead',
      error: error.message 
    });
  }
}

