import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const prompt = `Based on these music creator quiz responses, analyze and provide personalized recommendations:

RESPONSES:
- Motivation: ${responses.motivation}
- Ideal Day: ${responses['ideal-day']}
- Success Vision: ${responses['success-vision']}
- Current Stage: ${responses['stage-level']}
- Resource Priority: ${responses['resources-priority']}

TASK: Determine the best pathway and create personalized content.

PATHWAYS:
1. "touring-performer" - For live performance focused creators
2. "creative-artist" - For brand/content focused creators  
3. "writer-producer" - For behind-the-scenes focused creators

RESPONSE FORMAT (JSON only):
{
  "pathway": "one of the three pathways above",
  "personalizedDescription": "2-3 sentences tailored to their specific responses and goals",
  "customNextSteps": [
    "Specific actionable step 1 based on their stage and motivation",
    "Specific actionable step 2 that addresses their resource priority",
    "Specific actionable step 3 for their success vision",
    "Specific actionable step 4 relevant to their ideal day"
  ]
}

Make it personal, specific, and actionable based on their exact responses.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid AI response format');
    }
    
    // Get template data and combine with AI personalization
    const template = pathwayTemplates[aiResponse.pathway];
    if (!template) {
      throw new Error('Invalid pathway returned by AI');
    }
    
    const result = {
      ...template,
      description: aiResponse.personalizedDescription,
      nextSteps: aiResponse.customNextSteps,
      isPersonalized: true,
      responses // Include for debugging/analytics
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to template-based result
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
      isPersonalized: false
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