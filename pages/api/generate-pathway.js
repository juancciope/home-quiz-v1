import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Your Assistant ID from OpenAI dashboard
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_bSz8nzm3dYx8yrTbpFqh4ijR';

// Pathway templates with complete data
const pathwayTemplates = {
  'touring-performer': {
    title: 'The Touring Performer Path',
    icon: '🎤',
    nextSteps: [
      'Build a powerful 45-60 minute setlist that showcases your range',
      'Develop your stage presence through regular performance opportunities',
      'Create a professional EPK to pitch to venues and booking agents',
      'Network with booking professionals and venue owners in your scene'
    ],
    resources: [
      'Rehearsal Facility Access (24/7 at HOME)',
      'Live Sound & Performance Equipment',
      'Stage Presence Coaching Sessions',
      'Booking Strategy & Agent Connections',
      'Professional Photography & Video',
      'Tour Planning & Management Tools'
    ],
    homeConnection: 'HOME\'s 250-capacity venue and 24/7 rehearsal facilities are exactly what you need to perfect your live show and connect with industry professionals. Our venue hosts showcases where booking agents scout new talent, and our rehearsal spaces let you practice your setlist until it\'s bulletproof. Join our community to fast-track your performing career - attend our monthly webinar to learn the exact booking strategies our successful touring artists use.'
  },
  'creative-artist': {
    title: 'The Creative Artist Path',
    icon: '🎨',
    nextSteps: [
      'Define your unique artistic voice and visual brand identity',
      'Create a content strategy that showcases your creative process',
      'Develop multiple revenue streams: streaming, merchandise, content',
      'Build an authentic community around your art through storytelling'
    ],
    resources: [
      'Content Creation Studios & Equipment',
      'Brand Development & Visual Design',
      'Social Media Strategy & Management',
      'Revenue Diversification Coaching',
      'Video Production & Editing Tools',
      'Artist Community & Collaboration Network'
    ],
    homeConnection: 'HOME\'s content creation studios and brand development resources can accelerate your creative empire faster than going solo. Our facilities include professional video equipment, photography setups, and brand strategists who\'ve helped artists build six-figure creative businesses. The collaborative environment means you\'ll learn from other successful creative entrepreneurs. Secure your spot in our monthly webinar to discover the revenue diversification strategies that separate thriving artists from struggling ones.'
  },
  'writer-producer': {
    title: 'The Writer-Producer Path',
    icon: '🎹',
    nextSteps: [
      'Master your DAW and develop a signature production style',
      'Build a diverse portfolio showcasing your range across genres',
      'Network with artists, labels, and music supervisors',
      'Learn the business side: publishing, sync licensing, contracts'
    ],
    resources: [
      'Professional Recording Studios (24/7 access)',
      'Industry-Standard Production Equipment',
      'Collaboration Network & Artist Connections',
      'Music Business & Publishing Education',
      'Sync Licensing & Placement Opportunities',
      'Technical Skill Development Programs'
    ],
    homeConnection: 'HOME\'s professional studios with 24/7 access and A&R program connections are your fast-track to consistent income as a producer. Our facilities feature industry-standard equipment, and our community includes successful producers earning six figures through sync placements and label collaborations. You\'ll gain access to our exclusive network of artists seeking production work. Register for our monthly webinar to learn the business strategies that turn talented producers into highly-paid industry professionals.'
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { responses, fuzzyScores, pathwayBlend, scoreResult } = req.body;
    
    console.log('🤖 Generate pathway API called with:');
    console.log('📊 Fuzzy scores:', fuzzyScores);
    console.log('🎯 Pathway blend:', pathwayBlend);
    
    // Validate required fields
    if (!responses || !responses.motivation) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Try OpenAI Assistant first
    let useAssistant = true;
    if (!process.env.OPENAI_API_KEY || !ASSISTANT_ID) {
      console.log('⚠️ OpenAI not configured, using fallback only');
      useAssistant = false;
    }

    if (useAssistant) {
      try {
        console.log('🤖 Calling OpenAI Assistant for pathway generation...');

        // Create a thread
        const thread = await openai.beta.threads.create();

        // Add message to thread
await openai.beta.threads.messages.create(thread.id, {
  role: "user",
  content: `Analyze these music creator quiz responses and provide a personalized pathway recommendation.

RESPONSES:
- Motivation: ${responses.motivation}
- Ideal Day: ${responses['ideal-day']}
- Success Vision: ${responses['success-vision']}
- Current Stage: ${responses['stage-level']}
- Success Definition: ${responses['success-definition']}

FUZZY ALIGNMENT SCORES:
- Touring Performer: ${fuzzyScores?.['touring-performer'] || 0}%
- Creative Artist: ${fuzzyScores?.['creative-artist'] || 0}%
- Writer-Producer: ${fuzzyScores?.['writer-producer'] || 0}%

PATHWAY BLEND ANALYSIS:
- Type: ${pathwayBlend?.type || 'focused'}
- Description: ${pathwayBlend?.description || 'Single pathway alignment'}
- Primary Path: ${pathwayBlend?.primary || 'touring-performer'}
- Secondary Path: ${pathwayBlend?.secondary || 'none'}

SCORING V2 FOCUS LEVELS (use for guidance):
${scoreResult ? `
- Touring Performer: ${scoreResult.levels['touring-performer']} (${Math.round(scoreResult.absPct['touring-performer'])}% absolute)
- Creative Artist: ${scoreResult.levels['creative-artist']} (${Math.round(scoreResult.absPct['creative-artist'])}% absolute)
- Writer-Producer: ${scoreResult.levels['writer-producer']} (${Math.round(scoreResult.absPct['writer-producer'])}% absolute)
- Blend Type: ${scoreResult.blendType}
- Stage Level: ${scoreResult.stageLevel}` : 'Not available'}

Based on these fuzzy scores, blend analysis, and focus levels, please provide a nuanced recommendation that:
1. Acknowledges their percentage alignments across all pathways
2. Provides strategies that blend their primary and secondary pathways if scores are close
3. Offers specific advice for balancing multiple interests
4. Creates action steps that serve multiple pathway alignments where possible

Do not box them into a single category - acknowledge their unique blend and provide guidance that honors their multi-faceted interests.`
});

        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: ASSISTANT_ID
        });

        // Wait for completion
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        let attempts = 0;
        
        while (runStatus.status !== 'completed' && attempts < 30) {
          if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
            throw new Error(`Assistant run failed: ${runStatus.status}`);
          }
          
          // Wait before checking again
          await new Promise(resolve => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          attempts++;
        }

        if (runStatus.status !== 'completed') {
          throw new Error('Assistant run timed out');
        }

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        
        if (!assistantMessage) {
          throw new Error('No response from assistant');
        }

// Parse the assistant's response
const responseText = assistantMessage.content[0].text.value;
console.log('🎯 Assistant response received');

let aiResponse;
try {
  // Extract JSON from the response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    aiResponse = JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('No JSON found in assistant response');
  }
} catch (parseError) {
  console.error('Failed to parse assistant response:', parseError);
  throw new Error('Invalid assistant response format');
}

// Validate the response has all required fields
if (!aiResponse.pathway || 
    !aiResponse.customNextSteps || 
    !aiResponse.homeConnection ||
    !aiResponse.recommendedResources ||
    !aiResponse.pathwayDetails ||
    !aiResponse.pathwayDetails['touring-performer'] ||
    !aiResponse.pathwayDetails['creative-artist'] ||
    !aiResponse.pathwayDetails['writer-producer']) {
  console.error('Incomplete response:', aiResponse);
  throw new Error('Incomplete assistant response - missing pathwayDetails for all pathways');
}
        
// Get pathway metadata
const pathwayIcons = {
  'touring-performer': '🎤',
  'creative-artist': '🎨',
  'writer-producer': '🎹'
};

const pathwayTitles = {
  'touring-performer': 'The Touring Performer Path',
  'creative-artist': 'The Creative Artist Path',
  'writer-producer': 'The Writer-Producer Path'
};

// REMOVED: All sanitization code - OpenAI assistant should use correct terminology

// Format the response for the frontend
const result = {
  pathway: aiResponse.pathway,
  title: pathwayTitles[aiResponse.pathway] || 'Your Music Creator Path',
  description: aiResponse.personalizedDescription,
  icon: pathwayIcons[aiResponse.pathway] || '🎵',
  nextSteps: aiResponse.customNextSteps.map(step => ({
    priority: step.priority,
    step: step.step,
    detail: step.detail
  })),
  resources: aiResponse.recommendedResources,
  homeConnection: aiResponse.homeConnection,
  recommendation: scoreResult?.recommendation,
  // Include AI-generated pathway details for all pathways
  pathwayDetails: aiResponse.pathwayDetails,
  isPersonalized: true,
  assistantUsed: true
};

console.log('✅ Successfully generated personalized pathway:', {
  pathway: result.pathway,
  hasSteps: result.nextSteps.length,
  hasResources: result.resources.length
});

        console.log('✅ Successfully generated personalized pathway using Assistant');
        res.status(200).json(result);
        return;
        
      } catch (error) {
        console.error('🚨 Assistant API error:', error);
        console.log('📋 Falling back to template-based generation...');
      }
    }
    
    // Fallback to template-based result
    console.log('📋 Using fallback pathway generation for responses:', responses);
    const fallbackPathway = determineFallbackPathway(responses);
    console.log('🎯 Determined fallback pathway:', fallbackPathway);
    
    const template = pathwayTemplates[fallbackPathway];
    
    if (!template) {
      console.error('❌ No template found for pathway:', fallbackPathway);
      // Use touring-performer as ultimate fallback
      const ultimateFallback = pathwayTemplates['touring-performer'];
      const fallbackResult = {
        title: ultimateFallback.title,
        description: 'Based on your responses, this pathway offers a great starting point for your music career journey.',
        icon: ultimateFallback.icon,
        nextSteps: ultimateFallback.nextSteps,
        resources: ultimateFallback.resources,
        homeConnection: ultimateFallback.homeConnection,
        isPersonalized: false,
        assistantUsed: false,
        error: 'Template not found, using default'
      };
      
      console.log('✅ Using ultimate fallback result');
      res.status(200).json(fallbackResult);
      return;
    }
    
    const fallbackResult = {
      title: template.title,
      description: `${template.title.replace('The ', '').replace(' Path', '')} pathway aligns with your goals and current focus. This path will help you build the skills and connections needed for your music career.`,
      icon: template.icon,
      nextSteps: template.nextSteps,
      resources: template.resources,
      homeConnection: template.homeConnection, // 🔥 Now uses improved template content
      recommendation: scoreResult?.recommendation,
      isPersonalized: false,
      assistantUsed: false
    };
    
    console.log('✅ Generated fallback result:', {
      title: fallbackResult.title,
      hasNextSteps: !!fallbackResult.nextSteps?.length,
      hasResources: !!fallbackResult.resources?.length,
      hasHomeConnection: !!fallbackResult.homeConnection
    });
    
    res.status(200).json(fallbackResult);
    
  } catch (error) {
    console.error('❌ Generate pathway error:', error);
    
    // Return a basic fallback result even in case of error
    const emergencyFallback = {
      title: 'The Creative Artist Path',
      description: 'Your creative journey is unique, and this path will help you develop your artistic voice and build a sustainable music career.',
      icon: '🎨',
      nextSteps: [
        'Focus on developing your core creative skills',
        'Build connections with other creators in your field',
        'Create a consistent workflow for your projects',
        'Join the HOME community for support and resources'
      ],
      resources: [
        'Content Creation Studios & Equipment',
        'Brand Development & Visual Design',
        'Social Media Strategy & Management',
        'Artist Community & Collaboration Network'
      ],
      homeConnection: 'HOME\'s supportive community and professional facilities provide the perfect environment to grow your music career. Our content creation studios, collaborative artist network, and monthly educational webinars can accelerate your progress faster than going it alone. Secure your spot in our next webinar to learn the strategies successful artists use to build sustainable creative careers.',
      isPersonalized: false,
      assistantUsed: false,
      error: 'Emergency fallback used'
    };
    
    res.status(200).json(emergencyFallback);
  }
}

function determineFallbackPathway(responses) {
  // Simple scoring logic for fallback
  const scores = { 'touring-performer': 0, 'creative-artist': 0, 'writer-producer': 0 };
  
  console.log('🔍 Scoring responses:', responses);
  
  // Score based on responses
  if (responses.motivation === 'live-performance') {
    scores['touring-performer'] += 4;
    console.log('+ 4 to touring-performer (motivation: live-performance)');
  }
  if (responses.motivation === 'artistic-expression') {
    scores['creative-artist'] += 4;
    console.log('+ 4 to creative-artist (motivation: artistic-expression)');
  }
  if (responses.motivation === 'collaboration') {
    scores['writer-producer'] += 4;
    console.log('+ 4 to writer-producer (motivation: collaboration)');
  }
  
  if (responses['ideal-day'] === 'performing-travel') {
    scores['touring-performer'] += 3;
    console.log('+ 3 to touring-performer (ideal-day: performing-travel)');
  }
  if (responses['ideal-day'] === 'releasing-music') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (ideal-day: releasing-music)');
  }
  if (responses['ideal-day'] === 'writing-creating') {
    scores['writer-producer'] += 3;
    console.log('+ 3 to writer-producer (ideal-day: writing-creating)');
  }
  
  if (responses['success-vision'] === 'touring-headliner') {
    scores['touring-performer'] += 5;
    console.log('+ 5 to touring-performer (success-vision: touring-headliner)');
  }
  if (responses['success-vision'] === 'passive-income-artist') {
    scores['creative-artist'] += 5;
    console.log('+ 5 to creative-artist (success-vision: passive-income-artist)');
  }
  if (responses['success-vision'] === 'hit-songwriter') {
    scores['writer-producer'] += 5;
    console.log('+ 5 to writer-producer (success-vision: hit-songwriter)');
  }
  
  if (responses['biggest-challenge'] === 'performance-opportunities') {
    scores['touring-performer'] += 3;
    console.log('+ 3 to touring-performer (biggest-challenge: performance-opportunities)');
  }
  if (responses['biggest-challenge'] === 'brand-audience') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (biggest-challenge: brand-audience)');
  }
  if (responses['biggest-challenge'] === 'collaboration-income') {
    scores['writer-producer'] += 3;
    console.log('+ 3 to writer-producer (biggest-challenge: collaboration-income)');
  }
  
  console.log('📊 Final scores:', scores);
  
  const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  console.log('🏆 Winner:', winner);
  
  return winner;
}
