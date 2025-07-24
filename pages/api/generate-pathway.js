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

        // Wait for completion with shorter timeout
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        let attempts = 0;
        const maxAttempts = 20; // Reduced from 30 to 20 seconds
        
        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
          if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
            console.error(`❌ Assistant run failed with status: ${runStatus.status}`);
            throw new Error(`Assistant run failed: ${runStatus.status}`);
          }
          
          // Wait before checking again
          await new Promise(resolve => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          attempts++;
          
          console.log(`🔄 Assistant run status: ${runStatus.status} (attempt ${attempts}/${maxAttempts})`);
        }

        if (runStatus.status !== 'completed') {
          console.error(`❌ Assistant run timed out after ${maxAttempts} seconds`);
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
    !aiResponse.recommendedResources) {
  console.error('Incomplete response:', aiResponse);
  throw new Error('Incomplete assistant response');
}

// Log what we got from AI for debugging
console.log('🔍 AI Response recommendedCompanies:', JSON.stringify(aiResponse.recommendedCompanies, null, 2));
console.log('🔍 AI Response stepResources:', JSON.stringify(aiResponse.stepResources, null, 2));
console.log('🔍 AI Response recommendedResources:', JSON.stringify(aiResponse.recommendedResources, null, 2));
console.log('🔍 AI Response recommendedResources LENGTH:', aiResponse.recommendedResources?.length || 0);

// CRITICAL DEBUG: Check if OpenAI is actually generating resources
if (!aiResponse.recommendedResources || aiResponse.recommendedResources.length < 12) {
  console.error('❌ PROBLEM: OpenAI Assistant is NOT generating 12 resources!');
  console.error('📊 Expected: 12 unique resources');
  console.error('📊 Actual:', aiResponse.recommendedResources?.length || 0);
  console.error('📊 Using fallback resources instead');
} else {
  console.log('✅ OpenAI Assistant generated 12 resources correctly');
}

// Log what we got from AI for debugging
console.log('🔍 AI Response pathwayDetails:', JSON.stringify(aiResponse.pathwayDetails, null, 2));

// Check if pathwayDetails exist and log warning if missing
if (!aiResponse.pathwayDetails) {
  console.warn('⚠️ AI did not generate pathwayDetails - using fallback approach');
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
  resources: aiResponse.recommendedResources && aiResponse.recommendedResources.length >= 12 
    ? aiResponse.recommendedResources 
    : generateFallbackResources(aiResponse.pathway, scoreResult),
  stepResources: aiResponse.stepResources,
  homeConnection: aiResponse.homeConnection,
  recommendedCompanies: aiResponse.recommendedCompanies || generateFallbackCompanies(aiResponse.pathway, scoreResult),
  recommendation: scoreResult?.recommendation,
  // Include AI-generated pathway details for all pathways
  pathwayDetails: aiResponse.pathwayDetails || generateFallbackPathwayDetails(aiResponse.pathway, scoreResult),
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
        recommendedCompanies: generateFallbackCompanies('touring-performer', scoreResult),
        // Generate pathway details for emergency fallback
        pathwayDetails: generateFallbackPathwayDetails('touring-performer', scoreResult),
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
      recommendedCompanies: generateFallbackCompanies(fallbackPathway, scoreResult),
      recommendation: scoreResult?.recommendation,
      // Generate pathway details for fallback
      pathwayDetails: generateFallbackPathwayDetails(fallbackPathway, scoreResult),
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
      recommendedCompanies: generateFallbackCompanies('creative-artist', scoreResult),
      // Generate pathway details for emergency fallback
      pathwayDetails: generateFallbackPathwayDetails('creative-artist', scoreResult),
      isPersonalized: false,
      assistantUsed: false,
      error: 'Emergency fallback used'
    };
    
    res.status(200).json(emergencyFallback);
  }
}

function generateFallbackResources(pathway, scoreResult) {
  const stage = scoreResult?.stageLevel || 'planning';
  
  const resourcesByPathway = {
    'touring-performer': [
      // Step 1 - Foundation
      '24/7 rehearsal facility access for setlist development',
      'Basic performance equipment and sound system training',
      'Stage presence coaching with industry professionals',
      
      // Step 2 - Skill Development  
      'Advanced sound engineering and live mixing workshops',
      'Performance recording capabilities in 250-capacity venue',
      'Setlist strategy and audience engagement training',
      
      // Step 3 - Industry Connections
      'Booking agent networking events and pitch opportunities',
      'Venue relationship building through HOME showcase hosting',
      'Tour planning consultation with experienced managers',
      
      // Step 4 - Scaling
      'Professional photography and videography for EPKs',
      'Advanced tour logistics and routing strategy sessions',
      'Industry showcase hosting and A&R networking events'
    ],
    'creative-artist': [
      // Step 1 - Brand Foundation
      'Content creation studios with professional video equipment',
      'Brand development coaching and visual identity sessions',
      'Business planning guides for creative career strategy',
      
      // Step 2 - Content Creation
      'Video production and editing facility access (24/7)',
      'Social media strategy workshops with marketing experts',
      'Content planning tools and scheduling system training',
      
      // Step 3 - Audience Building
      'Creator collaboration network within 1,500+ member community',
      'Digital marketing campaign guidance and analytics training',
      'Fan community building strategies and engagement tools',
      
      // Step 4 - Revenue Scaling
      'Revenue diversification consultation with business experts',
      'Partnership facilitation for brand collaborations',
      'Advanced monetization coaching and e-commerce setup'
    ],
    'writer-producer': [
      // Step 1 - Technical Foundation
      '24/7 professional recording studio access',
      'Industry-standard production equipment and software training',
      'DAW optimization and workflow efficiency workshops',
      
      // Step 2 - Collaboration Building
      'Co-writing network access and collaboration facilitation',
      'Artist connection events and creative partnership matching',
      'Collaborative workspace access for team production sessions',
      
      // Step 3 - Business Development
      'Music business and publishing education programs',
      'Sync licensing connections and placement opportunities',
      'Royalty collection and publishing administration guidance',
      
      // Step 4 - Industry Scaling
      'A&R network access and label pitch opportunities',
      'Advanced production training and mixing/mastering workshops',
      'Industry mentor connections and career advancement coaching'
    ]
  };
  
  return resourcesByPathway[pathway] || resourcesByPathway['creative-artist'];
}

function generateFallbackCompanies(pathway, scoreResult) {
  const stage = scoreResult?.stageLevel || 'planning';
  
  const companiesByPathway = {
    'touring-performer': [
      {
        name: 'Bandsintown',
        description: 'Concert discovery platform used by 560,000+ artists. Essential for building your live show audience and tracking performance analytics.'
      },
      {
        name: 'High Road Touring',
        description: 'Respected independent booking agency with boutique approach. Great entry point for developing touring acts.'
      },
      {
        name: 'Live Nation Entertainment',
        description: "World's largest concert promoter. Key player for scaling your touring career to major venues and festivals."
      },
      {
        name: 'Songkick',
        description: 'Concert listing service integrated with Spotify. Helps fans discover your shows and builds your live audience.'
      }
    ],
    'creative-artist': [
      {
        name: 'DistroKid',
        description: 'Leading indie distributor handling 30-40% of new releases. Essential for getting your music on all streaming platforms.'
      },
      {
        name: 'Bandcamp',
        description: 'Direct-to-fan platform that has paid $1.3B+ to artists. Perfect for building a dedicated fanbase and selling music directly.'
      },
      {
        name: 'TuneCore',
        description: 'Pioneer DIY distributor with one-time fee model. Reliable option for independent artists maintaining ownership.'
      },
      {
        name: 'Spotify',
        description: "World's most popular streaming service with 675M monthly users. Critical platform for creative artists building audiences."
      }
    ],
    'writer-producer': [
      {
        name: 'ASCAP',
        description: 'Non-profit PRO with 1M+ members, free to join. Essential for collecting performance royalties on your compositions.'
      },
      {
        name: 'Songtradr',
        description: 'Global licensing marketplace with AI matching. Great platform for getting your productions placed in sync opportunities.'
      },
      {
        name: 'Kobalt Music Publishing',
        description: 'Tech-forward indie publisher with transparent royalties. Artist-friendly alternative to major publishers.'
      },
      {
        name: 'Universal Music Publishing',
        description: "World's largest publisher by revenue. Top-tier option when you're ready to scale your writing career."
      }
    ]
  };
  
  // Return all companies for the pathway (API will show all 4, but we can expand this list if needed)
  const companies = companiesByPathway[pathway] || companiesByPathway['creative-artist'];
  
  // For now, return the 4 we have, but in the future we should expand each array to have 10 companies
  return companies;
}

function generateFallbackPathwayDetails(primaryPathway, scoreResult) {
  const levels = scoreResult?.levels || {};
  
  const pathwayContent = {
    'touring-performer': {
      'Core Focus': {
        focusMessage: 'Live energy is your superpower. You come alive on stage and create magnetic connections with audiences. Your ability to command a room and deliver unforgettable experiences is your path to building a devoted fanbase and sustainable touring career.',
        focusAreas: 'Stage presence • Audience connection • Live sound • Touring strategy',
        growthAreas: 'Balance studio time with stage time • Build authentic social presence • Embrace new venues'
      },
      'Strategic Secondary': {
        focusMessage: 'Live performance can enhance your primary focus. Your stage presence and audience connection skills can amplify your main artistic path.',
        focusAreas: 'Performance skills • Audience engagement • Live presentation • Stage confidence',
        growthAreas: 'Integrate live elements into main path • Build performance confidence • Connect with live music community'
      },
      'Noise': {
        focusMessage: 'Performance skills can support your main strengths when needed.',
        focusAreas: 'Basic stage presence • Audience awareness • Live sound basics',
        growthAreas: 'Focus on main path • Minimal live performance when beneficial'
      }
    },
    'creative-artist': {
      'Core Focus': {
        focusMessage: 'You thrive on creative expression and building lasting connections with your audience. Your artistic vision is your competitive advantage in building sustainable income streams and meaningful impact.',
        focusAreas: 'Brand development • Content creation • Digital marketing • Revenue streams',
        growthAreas: 'Stay authentic to your vision • Balance content with artistic growth • Focus over trends'
      },
      'Strategic Secondary': {
        focusMessage: 'Creative skills can enhance your primary focus. Your ability to create content and build audience connections supports your main path.',
        focusAreas: 'Content creation • Visual branding • Social media • Audience building',
        growthAreas: 'Integrate creativity into main path • Build authentic online presence • Develop unique voice'
      },
      'Noise': {
        focusMessage: 'Creative skills can support your main strengths when strategically applied.',
        focusAreas: 'Basic content creation • Simple branding • Essential social media',
        growthAreas: 'Focus on main path • Use creativity to enhance core strengths'
      }
    },
    'writer-producer': {
      'Core Focus': {
        focusMessage: 'You excel behind the scenes, crafting the foundation that makes others shine. Your technical skills and collaborative nature are your pathway to consistent income and creative fulfillment.',
        focusAreas: 'Production skills • Collaboration network • Business development • Royalty optimization',
        growthAreas: 'Balance solo creativity with collaboration • Expand writing room networks • Build strategic partnerships'
      },
      'Strategic Secondary': {
        focusMessage: 'Production skills can enhance your primary focus. Your technical abilities and collaborative approach can support your main artistic path.',
        focusAreas: 'Technical skills • Collaboration • Music production • Business knowledge',
        growthAreas: 'Apply production skills to main path • Build technical confidence • Network with creators'
      },
      'Noise': {
        focusMessage: 'Production expertise can support your main strengths when beneficial.',
        focusAreas: 'Basic production knowledge • Technical awareness • Industry understanding',
        growthAreas: 'Focus on main path • Use production knowledge to enhance core work'
      }
    }
  };
  
  const result = {};
  
  // Generate content for all three pathways based on their levels
  ['touring-performer', 'creative-artist', 'writer-producer'].forEach(pathway => {
    const level = levels[pathway] || 'Noise';
    const content = pathwayContent[pathway][level] || pathwayContent[pathway]['Noise'];
    result[pathway] = content;
  });
  
  return result;
}

function determineFallbackPathway(responses) {
  // Simple scoring logic for fallback
  const scores = { 'touring-performer': 0, 'creative-artist': 0, 'writer-producer': 0 };
  
  console.log('🔍 Scoring responses:', responses);
  
  // Score based on v2 responses
  if (responses.motivation === 'stage-energy') {
    scores['touring-performer'] += 4;
    console.log('+ 4 to touring-performer (motivation: stage-energy)');
  }
  if (responses.motivation === 'creative-expression') {
    scores['creative-artist'] += 4;
    console.log('+ 4 to creative-artist (motivation: creative-expression)');
  }
  if (responses.motivation === 'behind-scenes') {
    scores['writer-producer'] += 4;
    console.log('+ 4 to writer-producer (motivation: behind-scenes)');
  }
  
  if (responses['ideal-day'] === 'performing') {
    scores['touring-performer'] += 3;
    console.log('+ 3 to touring-performer (ideal-day: performing)');
  }
  if (responses['ideal-day'] === 'creating-content') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (ideal-day: creating-content)');
  }
  if (responses['ideal-day'] === 'studio-work') {
    scores['writer-producer'] += 3;
    console.log('+ 3 to writer-producer (ideal-day: studio-work)');
  }
  
  if (responses['success-vision'] === 'touring-artist') {
    scores['touring-performer'] += 5;
    console.log('+ 5 to touring-performer (success-vision: touring-artist)');
  }
  if (responses['success-vision'] === 'creative-brand') {
    scores['creative-artist'] += 5;
    console.log('+ 5 to creative-artist (success-vision: creative-brand)');
  }
  if (responses['success-vision'] === 'in-demand-producer') {
    scores['writer-producer'] += 5;
    console.log('+ 5 to writer-producer (success-vision: in-demand-producer)');
  }
  
  if (responses['success-definition'] === 'live-performer') {
    scores['touring-performer'] += 3;
    console.log('+ 3 to touring-performer (success-definition: live-performer)');
  }
  if (responses['success-definition'] === 'online-audience') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (success-definition: online-audience)');
  }
  if (responses['success-definition'] === 'songwriter') {
    scores['writer-producer'] += 3;
    console.log('+ 3 to writer-producer (success-definition: songwriter)');
  }
  
  console.log('📊 Final scores:', scores);
  
  const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  console.log('🏆 Winner:', winner);
  
  return winner;
}
