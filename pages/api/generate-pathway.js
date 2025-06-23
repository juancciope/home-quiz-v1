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
    
    // Validate required fields
    if (!responses || !responses.motivation) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

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
- Current Stage: ${responses['stage-level']}
- Resource Priority: ${responses['resources-priority']}

Please provide personalized pathway recommendation in the specified JSON format.`
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Assistant run failed: ${runStatus.status}`);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
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
      ...template,
      description: aiResponse.personalizedDescription,
      nextSteps: aiResponse.customNextSteps,
      isPersonalized: true,
      assistantUsed: true,
      responses // Include for debugging/analytics
    };

    console.log('✅ Successfully generated personalized pathway using Assistant');
    res.status(200).json(result);
    
  } catch (error) {
    console.error('🚨 Assistant API error:', error);
    
    // Fallback to template-based result
    console.log('📋 Using fallback pathway generation...');
    const fallbackPathway = determineFallbackPathway(req.body.responses);
    const template = pathwayTemplates[fallbackPathway];
    
    const fallbackResult = {
      ...template,
      description: `${template.title.replace('The ', '').replace(' Path', '')} pathway aligns with your goals and current focus. This path will help you build the skills and connections needed for your music career.`,
      nextSteps: [
        'Focus on developing your core creative skills',
        'Build connections with other creators in your field',
        'Create a consistent workflow for your projects',
        'Join the HOME community for support and resources'
      ],
      isPersonalized: false,
      assistantUsed: false
    };
    
    res.status(200).json(fallbackResult);
  }
}

function determineFallbackPathway(responses) {
  // Simple scoring logic for fallback
  const scores = { 'touring-performer': 0, 'creative-artist': 0, 'writer-producer': 0 };
  
  // Score based on responses
  if (responses.motivation === 'stage-energy') scores['touring-performer'] += 3;
  if (responses.motivation === 'creative-expression') scores['creative-artist'] += 3;
  if (responses.motivation === 'behind-scenes') scores['writer-producer'] += 3;
  
  if (responses['ideal-day'] === 'performing') scores['touring-performer'] += 3;
  if (responses['ideal-day'] === 'creating-content') scores['creative-artist'] += 3;
  if (responses['ideal-day'] === 'studio-work') scores['writer-producer'] += 3;
  
  if (responses['success-vision'] === 'touring-artist') scores['touring-performer'] += 4;
  if (responses['success-vision'] === 'creative-brand') scores['creative-artist'] += 4;
  if (responses['success-vision'] === 'in-demand-producer') scores['writer-producer'] += 4;
  
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}
