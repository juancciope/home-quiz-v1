// Import the Circle integration (you'll need to create this as a separate file)
// const { createCirclePost } = require('../utils/circle-integration');
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
// Circle integration functions (embedded for now - you can move to separate file)
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
        "text": `${results?.pathway_icon || '🎵'} ${pathway}`,
        "circle_ios_fallback_text": `${results?.pathway_icon || '🎵'} ${pathway}`
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
  if (results?.pathway_description) {
    content.push({
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": results.pathway_description,
          "circle_ios_fallback_text": results.pathway_description
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
    'success-vision': "Success vision in 5 years:",
    'current-stage': "Current stage:",
    'biggest-challenge': "Biggest challenge:"
  };

  const valueMap = {
    'live-performance': 'The energy of a live audience and performing music from the stage',
    'artistic-expression': 'Artistic expression through recording music and building a loyal following online',
    'collaboration': 'Making great songs and collaborating with other talented creators',
    'performing-travel': 'Traveling to a new city to perform for a live audience',
    'releasing-music': 'Releasing a new song that you are really proud of',
    'writing-creating': 'Writing the best song that you have ever written',
    'touring-headliner': 'Headlining major tours and playing sold out shows around the world',
    'passive-income-artist': 'Earning passive income from a large streaming audience, branded merch sales, and fan subscriptions',
    'hit-songwriter': 'Having multiple major hit songs that you collaborated on and earning \'mailbox money\' through sync placements and other royalty streams',
    'planning': 'Planning Stage - Figuring out my path and building foundations',
    'production': 'Production Stage - Actively creating and releasing work',
    'scale': 'Scale Stage - Already making the majority of my income from music and looking to grow my business',
    'performance-opportunities': 'I need more opportunities to perform and grow my live audience',
    'brand-audience': 'I\'m creating great content, but struggle to build a consistent brand and online audience',
    'collaboration-income': 'I work behind the scenes, but need better access to collaborators, placements, and consistent income'
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

  const nextSteps = results?.customNextSteps || results?.next_steps || [];
  if (Array.isArray(nextSteps)) {
    nextSteps.forEach((step, index) => {
      const stepText = typeof step === 'object' ? step.step : step;
      const priority = typeof step === 'object' ? step.priority : index + 1;
      
      content.push({
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "marks": [{ "type": "bold" }],
            "text": `${priority}. `,
            "circle_ios_fallback_text": `${priority}. `
          },
          {
            "type": "text",
            "text": stepText,
            "circle_ios_fallback_text": stepText
          }
        ]
      });
    });
  }

  // Add recommended resources section
  content.push({
    "type": "heading",
    "attrs": { "level": 3 },
    "content": [
      {
        "type": "text",
        "text": "📚 Recommended Resources",
        "circle_ios_fallback_text": "Recommended Resources"
      }
    ]
  });

  const resources = results?.recommended_resources || results?.resources || [];
  if (Array.isArray(resources)) {
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
  if (results?.home_connection) {
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
          "text": results.home_connection,
          "circle_ios_fallback_text": results.home_connection
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
        "text": results?.is_personalized ? 
          "✨ This roadmap was AI-personalized based on the user's specific responses." :
          "📋 This roadmap was generated using template-based recommendations.",
        "circle_ios_fallback_text": results?.is_personalized ? 
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, pathway, responses, source, results } = req.body;
    
    console.log('📧 Submit Lead API called with:', {
      email,
      pathway,
      hasResponses: !!responses,
      hasResults: !!results,
      resultsKeys: results ? Object.keys(results) : [],
      nextStepsType: results?.customNextSteps ? 'customNextSteps (new format)' : results?.next_steps ? 'next_steps (old format)' : 'none',
      nextStepsLength: (results?.customNextSteps || results?.next_steps)?.length || 0,
      firstStepStructure: (results?.customNextSteps || results?.next_steps)?.[0]
    });
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const formatResources = (resources) => {
      if (!resources || !Array.isArray(resources)) return '';
      return resources.map(resource => `• ${resource}`).join('\n');
    };

    const formattedNextSteps = formatNextSteps(results?.customNextSteps || results?.next_steps);
    const formattedResources = formatResources(results?.recommended_resources || results?.resources);
    
    console.log('🔧 Formatted content preview:', {
      nextStepsPreview: formattedNextSteps.substring(0, 100) + '...',
      resourcesPreview: formattedResources.substring(0, 100) + '...',
      nextStepsLength: formattedNextSteps.length,
      resourcesLength: formattedResources.length
    });

    // Prepare comprehensive data for GHL
    const ghlData = {
      email,
      source: source || 'music-creator-roadmap-quiz',
      pathway: pathway || 'Unknown',
      tags: [
        'quiz-completed',
        `pathway-${(pathway || 'unknown').toLowerCase().replace(/\s+/g, '-').replace('the-', '')}`,
        `stage-${responses?.['current-stage'] || 'unknown'}`,
        `challenge-${responses?.['biggest-challenge'] || 'unknown'}`.substring(0, 30)
      ],
custom_fields: {
  // Quiz responses
  motivation: responses?.motivation || '',
  ideal_day: responses?.['ideal-day'] || '',
  success_vision: responses?.['success-vision'] || '',
  current_stage: responses?.['stage-level'] || '',
  resources_priority: responses?.['resources-priority'] || '',
  
  // Pathway information
  pathway: results?.pathway || pathway || '',
  pathway_title: results?.title || pathway || '',
  pathway_description: results?.description || '',
  pathway_icon: results?.icon || '',
  
  // Formatted next steps (with and without details)
  next_steps_full: formatNextStepsWithDetails(results?.nextSteps),
  next_steps_simple: formatNextStepsSimple(results?.nextSteps),
  
  // Individual steps for email templates
  next_step_1: getStepText(results?.nextSteps?.[0]),
  next_step_1_detail: getStepDetail(results?.nextSteps?.[0]),
  next_step_2: getStepText(results?.nextSteps?.[1]),
  next_step_2_detail: getStepDetail(results?.nextSteps?.[1]),
  next_step_3: getStepText(results?.nextSteps?.[2]),
  next_step_3_detail: getStepDetail(results?.nextSteps?.[2]),
  next_step_4: getStepText(results?.nextSteps?.[3]),
  next_step_4_detail: getStepDetail(results?.nextSteps?.[3]),
  
  // Resources
  recommended_resources: results?.resources?.join('\n• ') || '',
  resource_1: results?.resources?.[0] || '',
  resource_2: results?.resources?.[1] || '',
  resource_3: results?.resources?.[2] || '',
  resource_4: results?.resources?.[3] || '',
  resource_5: results?.resources?.[4] || '',
  resource_6: results?.resources?.[5] || '',
  
  // HOME connection
  home_connection: results?.homeConnection || '',
  
  // Meta information
  is_personalized: results?.isPersonalized ? 'Yes' : 'No',
  assistant_used: results?.assistantUsed ? 'Yes' : 'No',
  quiz_completed_date: new Date().toISOString(),
  quiz_completion_time: new Date().toLocaleString('en-US', { 
    timeZone: 'America/Chicago',
    dateStyle: 'medium',
    timeStyle: 'short'
  }),
  
  // Additional context
  source: source || 'music-creator-roadmap-quiz',
  webinar_offer: 'Music Creator Roadmap Course ($299 value) + Artist Branding Playbook (FREE bonus)',
  community_size: '1,000+ music creators',
}
    };

    console.log('🔄 Sending to GHL webhook:', {
      url: process.env.GHL_WEBHOOK_URL ? 'URL configured' : 'NO URL',
      email: ghlData.email,
      pathway: ghlData.pathway,
      tags: ghlData.tags,
      customFieldsCount: Object.keys(ghlData.custom_fields).length,
      hasNextSteps: !!(results?.customNextSteps?.length || results?.next_steps?.length),
      hasResources: !!(results?.recommended_resources?.length)
    });

    let ghlSuccess = false;
    let ghlResult = null;

    // Send to Go High Level
    if (!process.env.GHL_WEBHOOK_URL) {
      console.warn('⚠️ GHL_WEBHOOK_URL not configured, skipping webhook call');
    } else {
      try {
        const ghlResponse = await fetch(process.env.GHL_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ghlData)
        });

        console.log('📡 GHL Response:', {
          status: ghlResponse.status,
          statusText: ghlResponse.statusText,
          ok: ghlResponse.ok
        });

        if (ghlResponse.ok) {
          ghlResult = await ghlResponse.json();
          ghlSuccess = true;
          console.log('✅ Lead submitted to GHL successfully');
        } else {
          const errorText = await ghlResponse.text();
          console.error('❌ GHL webhook failed:', errorText);
        }
      } catch (ghlError) {
        console.error('❌ GHL webhook error:', ghlError);
      }
    }

    // Post to Circle (independent of GHL success)
    let circleResult = null;
    if (process.env.CIRCLE_API_TOKEN) {
      console.log('🔄 Posting results to Circle...');
      circleResult = await createCirclePost(email, pathway, responses, results);
    } else {
      console.warn('⚠️ CIRCLE_API_TOKEN not configured, skipping Circle post');
    }

    console.log('✅ Quiz submission complete:', { 
      email, 
      pathway: ghlData.pathway,
      ghlSuccess,
      circleSuccess: circleResult?.success || false,
      circlePostId: circleResult?.postId,
      circleUrl: circleResult?.url
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Lead and results submitted successfully',
      data: {
        email,
        pathway: ghlData.pathway,
        hasPersonalizedResults: results?.is_personalized || false,
        submittedAt: new Date().toISOString(),
        ghl: {
          success: ghlSuccess,
          result: ghlResult
        },
        circle: {
          success: circleResult?.success || false,
          postId: circleResult?.postId,
          url: circleResult?.url,
          error: circleResult?.error
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Lead submission error:', error);
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for completing the quiz!',
      note: 'If you don\'t receive your results via email, please contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
