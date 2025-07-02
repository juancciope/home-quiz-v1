// Helper function to extract step text from various formats
const getStepText = (step) => {
  if (!step) return '';
  if (typeof step === 'string') return step;
  if (step.step) return step.step;
  return '';
};

// Helper function to extract step detail
const getStepDetail = (step) => {
  if (!step) return '';
  if (typeof step === 'object' && step.detail) return step.detail;
  return '';
};

// Format next steps with details for email/CRM
const formatNextStepsWithDetails = (steps) => {
  if (!steps || !Array.isArray(steps)) return '';
  
  return steps.map((step, index) => {
    const stepText = getStepText(step);
    const detail = getStepDetail(step);
    const priority = (typeof step === 'object' && step.priority) ? step.priority : index + 1;
    
    if (detail) {
      return `${priority}. ${stepText}\n   → ${detail}`;
    }
    return `${priority}. ${stepText}`;
  }).join('\n\n');
};

// Format next steps without details (just the action items)
const formatNextStepsSimple = (steps) => {
  if (!steps || !Array.isArray(steps)) return '';
  
  return steps.map((step, index) => {
    const stepText = getStepText(step);
    const priority = (typeof step === 'object' && step.priority) ? step.priority : index + 1;
    return `${priority}. ${stepText}`;
  }).join('\n');
};

// Circle integration functions
const CIRCLE_API_URL = 'https://app.circle.so/api/admin/v2/posts';
const CIRCLE_SPACE_ID = 2102224;

const formatQuizResultsForCircle = (email, pathway, responses, results) => {
  const content = [];
  
  // Add email address at the top
  content.push({
    "type": "paragraph",
    "content": [
      {
        "type": "text",
        "marks": [{ "type": "bold" }],
        "text": `📧 Email: ${email}`,
        "circle_ios_fallback_text": `Email: ${email}`
      }
    ]
  });
  
  // Add header with pathway info
  content.push({
    "type": "heading",
    "attrs": { "level": 2 },
    "content": [
      {
        "type": "text",
        "text": `${results?.icon || '🎵'} ${results?.title || pathway}`,
        "circle_ios_fallback_text": `${results?.icon || '🎵'} ${results?.title || pathway}`
      }
    ]
  });

  // Add completion timestamp
  content.push({
    "type": "paragraph",
    "content": [
      {
        "type": "text",
        "text": `📅 Quiz completed: ${new Date().toLocaleString('en-US', { 
          timeZone: 'America/Chicago',
          dateStyle: 'full',
          timeStyle: 'short'
        })}`,
        "circle_ios_fallback_text": `Quiz completed: ${new Date().toLocaleString()}`
      }
    ]
  });

  // Add pathway description
  if (results?.description) {
    content.push({
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": results.description,
          "circle_ios_fallback_text": results.description
        }
      ]
    });
  }

  // Add quiz responses section
  content.push({
    "type": "heading",
    "attrs": { "level": 3 },
    "content": [
      {
        "type": "text",
        "text": "📝 Quiz Responses",
        "circle_ios_fallback_text": "Quiz Responses"
      }
    ]
  });

  // Format responses
  const responseLabels = {
    motivation: "What drives your music career ambitions?",
    'ideal-day': "Ideal workday as a music professional:",
    'success-vision': "Success vision in 3 years:",
    'stage-level': "Current stage:",
    'resources-priority': "Resources priority:"
  };

  const valueMap = {
    'stage-energy': 'The energy of a live audience and performing music from the stage',
    'creative-expression': 'Artistic expression through recording music and building a loyal following online',
    'behind-scenes': 'Making great songs and collaborating with other talented creators',
    'performing': 'Traveling to a new city to perform for a live audience',
    'creating-content': 'Releasing a new song that you are really proud of',
    'studio-work': 'Writing the best song that you have ever written',
    'touring-artist': 'Headlining major tours and playing sold out shows around the world',
    'creative-brand': 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions',
    'in-demand-producer': 'Having multiple major hit songs that you collaborated on and earning mailbox money through sync placements and other royalty streams',
    'planning': 'Planning Stage - Figuring out my path and building foundations',
    'production': 'Production Stage - Actively creating and releasing work',
    'scale': 'Scale Stage - Ready to grow and expand my existing success',
    'performance-facilities': 'Rehearsal spaces, live sound equipment, and performance opportunities',
    'content-creation': 'Recording studios, video production, and content creation tools',
    'collaboration-network': 'Access to other creators, producers, and industry professionals',
    'business-mentorship': 'Business guidance, marketing strategy, and industry connections'
  };

  Object.entries(responses || {}).forEach(([key, value]) => {
    if (responseLabels[key]) {
      content.push({
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "marks": [{ "type": "bold" }],
            "text": `${responseLabels[key]} `,
            "circle_ios_fallback_text": `${responseLabels[key]} `
          },
          {
            "type": "text",
            "text": valueMap[value] || value,
            "circle_ios_fallback_text": valueMap[value] || value
          }
        ]
      });
    }
  });

  // Add next steps section
  content.push({
    "type": "heading",
    "attrs": { "level": 3 },
    "content": [
      {
        "type": "text",
        "text": "🎯 Personalized Next Steps",
        "circle_ios_fallback_text": "Personalized Next Steps"
      }
    ]
  });

  const nextSteps = results?.nextSteps || [];
  if (Array.isArray(nextSteps)) {
    nextSteps.forEach((step) => {
      const priority = step.priority || 1;
      const stepText = step.step || step;
      const detail = step.detail || '';
      
      // Add the main step
      content.push({
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "marks": [{ "type": "bold" }],
            "text": `Step ${priority}: `,
            "circle_ios_fallback_text": `Step ${priority}: `
          },
          {
            "type": "text",
            "text": stepText,
            "circle_ios_fallback_text": stepText
          }
        ]
      });
      
      // Add the detail if present
      if (detail) {
        content.push({
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "marks": [{ "type": "italic" }],
              "text": `→ ${detail}`,
              "circle_ios_fallback_text": `→ ${detail}`
            }
          ]
        });
      }
    });
  }

  // Add recommended resources section
  const resources = results?.resources || [];
  if (resources.length > 0) {
    content.push({
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [
        {
          "type": "text",
          "text": "📚 Recommended HOME Resources",
          "circle_ios_fallback_text": "Recommended HOME Resources"
        }
      ]
    });

    resources.forEach(resource => {
      content.push({
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": `• ${resource}`,
            "circle_ios_fallback_text": `• ${resource}`
          }
        ]
      });
    });
  }

  // Add HOME connection section
  if (results?.homeConnection) {
    content.push({
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [
        {
          "type": "text",
          "text": "🏡 How HOME Supports This Journey",
          "circle_ios_fallback_text": "How HOME Supports This Journey"
        }
      ]
    });

    content.push({
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": results.homeConnection,
          "circle_ios_fallback_text": results.homeConnection
        }
      ]
    });
  }

  // Add personalization note
  content.push({
    "type": "paragraph",
    "content": [
      {
        "type": "text",
        "marks": [{ "type": "italic" }],
        "text": results?.isPersonalized ? 
          "✨ This roadmap was AI-personalized based on the user's specific responses." :
          "📋 This roadmap was generated using template-based recommendations.",
        "circle_ios_fallback_text": results?.isPersonalized ? 
          "This roadmap was AI-personalized based on the user's specific responses." :
          "This roadmap was generated using template-based recommendations."
      }
    ]
  });

  return {
    "type": "doc",
    "content": content
  };
};

const createCirclePost = async (email, pathway, responses, results) => {
  try {
    console.log('🔄 Creating Circle post for:', email);
    
    const slug = `quiz-result-${email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`;
    const tiptapBody = formatQuizResultsForCircle(email, pathway, responses, results);
    
    const postData = {
      space_id: CIRCLE_SPACE_ID,
      status: "published",
      name: `${email} - Music Creator Roadmap Results`,
      slug: slug,
      tiptap_body: {
        body: tiptapBody
      }
    };

    console.log('📤 Sending to Circle:', {
      email,
      pathway,
      slug,
      contentSections: tiptapBody.content.length
    });

    const response = await fetch(CIRCLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CIRCLE_API_TOKEN}`,
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Circle API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Circle post created successfully:', {
      postId: result.post?.id,
      url: result.post?.url,
      email
    });

    return {
      success: true,
      postId: result.post?.id,
      url: result.post?.url,
      message: result.message
    };

  } catch (error) {
    console.error('❌ Failed to create Circle post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Main handler function
export default async function handler(req, res) {
  // CRITICAL DEBUG LOGGING
  console.log('🔔 =================================');
  console.log('🔔 SUBMIT-LEAD API CALLED');
  console.log('🔔 Method:', req.method);
  console.log('🔔 Has results?:', !!req.body?.results);
  console.log('🔔 Results keys:', req.body?.results ? Object.keys(req.body.results) : 'NO RESULTS');
  console.log('🔔 =================================');
  
  // Check environment variables
  console.log('🔧 Environment check:');
  console.log('- GHL_WEBHOOK_URL exists:', !!process.env.GHL_WEBHOOK_URL);
  console.log('- GHL_WEBHOOK_URL length:', process.env.GHL_WEBHOOK_URL?.length);
  console.log('- GHL_WEBHOOK_URL preview:', process.env.GHL_WEBHOOK_URL ? 
    process.env.GHL_WEBHOOK_URL.substring(0, 30) + '...' : 'NOT SET');
  console.log('- CIRCLE_API_TOKEN exists:', !!process.env.CIRCLE_API_TOKEN);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, pathway, responses, source, results } = req.body;
    
    console.log('📧 Submit Lead API detailed data:', {
      email,
      pathway,
      hasResponses: !!responses,
      hasResults: !!results,
      resultsStructure: results ? {
        pathway: results.pathway,
        title: results.title,
        hasDescription: !!results.description,
        nextStepsCount: results.nextSteps?.length || 0,
        nextStepsFormat: results.nextSteps?.[0] ? typeof results.nextSteps[0] : 'none',
        resourcesCount: results.resources?.length || 0,
        hasHomeConnection: !!results.homeConnection,
        isPersonalized: results.isPersonalized,
        assistantUsed: results.assistantUsed
      } : null
    });

    // Format response data for GHL webhook
    const formattedResponses = Object.entries(responses || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const webhookData = {
      email,
      pathway: results?.title || pathway || 'Unknown Pathway',
      source: source || 'music-creator-roadmap-quiz',
      quiz_responses: formattedResponses,
      next_steps: formatNextStepsWithDetails(results?.nextSteps || []),
      next_steps_simple: formatNextStepsSimple(results?.nextSteps || []),
      recommended_resources: results?.resources?.join(', ') || 'Standard HOME Resources',
      home_connection: results?.homeConnection || 'HOME provides the perfect environment to accelerate your music career journey.',
      stage: responses?.['stage-level'] || 'Unknown',
      motivation: responses?.motivation || 'Unknown',
      success_vision: responses?.['success-vision'] || 'Unknown',
      is_personalized: results?.isPersonalized ? 'Yes' : 'No',
      assistant_used: results?.assistantUsed ? 'Yes' : 'No',
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Sending to GHL webhook:', {
      url: process.env.GHL_WEBHOOK_URL ? 'SET' : 'NOT SET',
      email: webhookData.email,
      pathway: webhookData.pathway
    });

    // Send to GHL webhook
    let ghlResult = { success: false, message: 'Webhook not configured' };
    if (process.env.GHL_WEBHOOK_URL) {
      try {
        const ghlResponse = await fetch(process.env.GHL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookData)
        });
        
        ghlResult = {
          success: ghlResponse.ok,
          status: ghlResponse.status,
          message: ghlResponse.ok ? 'Lead sent to GHL' : 'GHL webhook failed'
        };
        
        console.log('✅ GHL webhook response:', ghlResult);
      } catch (error) {
        console.error('❌ GHL webhook error:', error);
        ghlResult = {
          success: false,
          error: error.message
        };
      }
    }

    // Create Circle post
    let circleResult = { success: false, message: 'Circle not configured' };
    if (process.env.CIRCLE_API_TOKEN) {
      circleResult = await createCirclePost(email, pathway, responses, results);
    }

    // Return success even if webhooks fail
    res.status(200).json({ 
      success: true,
      message: 'Lead data received',
      data: {
        ghl: ghlResult,
        circle: circleResult
      }
    });
    
  } catch (error) {
    console.error('❌ Submit lead error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process lead submission',
      error: error.message 
    });
  }
}
