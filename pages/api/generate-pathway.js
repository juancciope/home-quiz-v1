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
    homeConnection: 'HOME\'s 250-capacity venue and rehearsal facilities provide the perfect environment to develop your live show and connect with booking professionals.'
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
    homeConnection: 'HOME\'s content creation facilities and collaborative artist community provide the tools and connections to build your creative empire.'
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
    homeConnection: 'HOME\'s professional studios and A&R program provide the perfect ecosystem for producers to create and collaborate.'
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { responses } = req.body;
    
    console.log('🤖 Generate pathway API called with responses:', responses);
    
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
          content: `Analyze these music creator quiz responses and provide pathway recommendation:

RESPONSES:
- Motivation: ${responses.motivation}
- Ideal Day: ${responses['ideal-day']}
- Success Vision: ${responses['success-vision']}
- Current Stage: ${responses['current-stage']}
- Biggest Challenge: ${responses['biggest-challenge']}

Please provide personalized pathway recommendation in the specified JSON format with prioritized next steps.`
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
        console.log('🎯 Assistant response:', responseText);

        let aiResponse;
        try {
          // Try to extract JSON from the response
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
        
        // Get template data and combine with AI personalization
        const template = pathwayTemplates[aiResponse.pathway];
        if (!template) {
          throw new Error('Invalid pathway returned by assistant');
        }
        
        const result = {
          title: template.title,
          description: aiResponse.personalizedDescription,
          icon: template.icon,
          nextSteps: aiResponse.customNextSteps,
          resources: template.resources,
          homeConnection: template.homeConnection,
          isPersonalized: true,
          assistantUsed: true,
          responses // Include for debugging/analytics
        };

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
      homeConnection: template.homeConnection,
      isPersonalized: false,
      assistantUsed: false
    };
    
    console.log('✅ Generated fallback result:', {
      title: fallbackResult.title,
      hasNextSteps: !!fallbackResult.nextSteps?.length,
      hasResources: !!fallbackResult.resources?.length
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
      homeConnection: 'HOME\'s supportive community and professional facilities provide the perfect environment to grow your music career.',
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
  
  // Score based on responses - FIXED: Added missing business-building case
  if (responses.motivation === 'stage-energy') {
    scores['touring-performer'] += 3;
    console.log('+ 3 to touring-performer (motivation: stage-energy)');
  }
  if (responses.motivation === 'creative-expression') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (motivation: creative-expression)');
  }
  if (responses.motivation === 'behind-scenes') {
    scores['writer-producer'] += 3;
    console.log('+ 3 to writer-producer (motivation: behind-scenes)');
  }
  if (responses.motivation === 'business-building') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (motivation: business-building)');
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
  if (responses['ideal-day'] === 'strategy-networking') {
    scores['creative-artist'] += 3;
    console.log('+ 3 to creative-artist (ideal-day: strategy-networking)');
  }
  
  if (responses['success-vision'] === 'touring-artist') {
    scores['touring-performer'] += 4;
    console.log('+ 4 to touring-performer (success-vision: touring-artist)');
  }
  if (responses['success-vision'] === 'creative-brand') {
    scores['creative-artist'] += 4;
    console.log('+ 4 to creative-artist (success-vision: creative-brand)');
  }
  if (responses['success-vision'] === 'in-demand-producer') {
    scores['writer-producer'] += 4;
    console.log('+ 4 to writer-producer (success-vision: in-demand-producer)');
  }
  
  console.log('📊 Final scores:', scores);
  
  const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  console.log('🏆 Winner:', winner);
  
  return winner;
}
