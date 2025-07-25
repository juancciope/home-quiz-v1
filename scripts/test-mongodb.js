import dbConnect from '../lib/mongoose.js';
import ArtistProfile from '../models/ArtistProfile.js';
import QuizSubmission from '../models/QuizSubmission.js';
import LeadEvent from '../models/LeadEvent.js';

async function testMongoDBConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    await dbConnect();
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a sample artist profile
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`\n📧 Creating test artist profile with email: ${testEmail}`);
    
    const artistProfile = new ArtistProfile({
      email: testEmail,
      profile: {
        name: 'Test Artist',
        stageName: 'TestStage',
        genres: ['rock', 'pop'],
        roles: ['performer', 'songwriter']
      },
      career: {
        stage: 'planning',
        startedAt: new Date()
      },
      tags: ['test', 'quiz-completed']
    });
    
    await artistProfile.save();
    console.log('✅ Artist profile created:', artistProfile._id);
    
    // Test updating pathway scores
    const scores = {
      'touring-performer': 75,
      'creative-artist': 60,
      'writer-producer': 45
    };
    
    const recommendation = {
      pathway: 'touring-performer',
      levels: {
        'touring-performer': 'Core Focus',
        'creative-artist': 'Strategic Secondary',
        'writer-producer': 'Noise'
      },
      pathwayDetails: {
        'touring-performer': {
          focusAreas: 'Stage presence • Audience connection • Live sound • Touring strategy'
        }
      }
    };
    
    await artistProfile.updatePathwayScores(scores, recommendation);
    console.log('✅ Pathway scores updated');
    
    // Test creating a quiz submission
    const quizSubmission = new QuizSubmission({
      artistProfileId: artistProfile._id,
      email: testEmail,
      responses: {
        motivation: 'live-performance',
        idealDay: 'performing-travel',
        successVision: 'touring-headliner',
        stageLevel: 'planning',
        successDefinition: 'audience-impact'
      },
      results: {
        fuzzyScores: scores,
        recommendation: {
          pathway: 'touring-performer',
          description: 'Test description',
          nextSteps: [
            { priority: 1, step: 'Build your live set', detail: 'Start with 5 original songs' }
          ],
          resources: ['24/7 rehearsal space', 'Performance coaching'],
          companies: [
            { name: 'Bandsintown', description: 'Concert discovery platform', url: 'https://bandsintown.com' }
          ]
        },
        aiGenerated: false
      }
    });
    
    await quizSubmission.save();
    console.log('✅ Quiz submission created:', quizSubmission._id);
    
    // Test creating an event
    await LeadEvent.createEvent(
      artistProfile._id,
      'quiz_completed',
      { pathway: 'touring-performer', scores },
      { ip: '127.0.0.1', userAgent: 'Test Script' }
    );
    console.log('✅ Lead event created');
    
    // Query test
    console.log('\n🔍 Testing queries...');
    const foundProfile = await ArtistProfile.findOne({ email: testEmail });
    console.log('✅ Found profile:', foundProfile.displayName);
    console.log('   Primary pathway:', foundProfile.pathways.primary.type);
    console.log('   Primary level:', foundProfile.pathways.primary.level);
    
    const submissions = await QuizSubmission.find({ artistProfileId: foundProfile._id });
    console.log('✅ Found', submissions.length, 'quiz submissions');
    
    const events = await LeadEvent.find({ artistProfileId: foundProfile._id });
    console.log('✅ Found', events.length, 'events');
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await ArtistProfile.deleteOne({ _id: artistProfile._id });
    await QuizSubmission.deleteOne({ _id: quizSubmission._id });
    await LeadEvent.deleteMany({ artistProfileId: artistProfile._id });
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 All tests passed! MongoDB integration is working correctly.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testMongoDBConnection();