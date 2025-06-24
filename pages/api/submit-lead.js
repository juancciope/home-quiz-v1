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

    // Format next steps for email template
    const formatNextSteps = (steps) => {
      if (!steps || !Array.isArray(steps)) return '';
      
      // Handle new OpenAI format with priority objects
      if (steps.length > 0 && typeof steps[0] === 'object' && steps[0].step) {
        return steps.map((stepObj, index) => `${stepObj.priority || index + 1}. ${stepObj.step}`).join('\n');
      }
      
      // Handle legacy simple array format
      return steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
    };

    // Format recommended resources for email template
    const formatResources = (resources) => {
      if (!resources || !Array.isArray(resources)) return '';
      
      return resources.map(resource => `• ${resource}`).join('\n');
    };

    // Debug formatted content
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
        `challenge-${responses?.['biggest-challenge'] || 'unknown'}`.substring(0, 30) // Limit tag length
      ],
      custom_fields: {
        // Original quiz responses
        motivation: responses?.motivation || '',
        ideal_day: responses?.['ideal-day'] || '',
        success_vision: responses?.['success-vision'] || '',
        current_stage: responses?.['current-stage'] || '',
        biggest_challenge: responses?.['biggest-challenge'] || '',
        quiz_completed_date: new Date().toISOString(),
        
        // Results data for personalized emails
        pathway_title: results?.pathway_title || pathway || '',
        pathway_description: results?.pathway_description || '',
        pathway_icon: results?.pathway_icon || '',
        home_connection: results?.home_connection || '',
        is_personalized: results?.is_personalized || false,
        
        // Formatted content for email templates (these are the main ones used in email)
        next_steps: formattedNextSteps,
        recommended_resources: formattedResources,
        
        // Legacy formatted fields for backward compatibility
        next_steps_formatted: formattedNextSteps,
        recommended_resources_formatted: formattedResources,
        
        // Raw arrays for advanced email builders (JSON strings)
        next_steps_array: JSON.stringify(results?.customNextSteps || results?.next_steps || []),
        recommended_resources_array: JSON.stringify(results?.recommended_resources || results?.resources || []),
        
        // Individual next steps (for drag-and-drop email builders)
        next_step_1: (results?.customNextSteps || results?.next_steps)?.[0]?.step || (results?.customNextSteps || results?.next_steps)?.[0] || '',
        next_step_2: (results?.customNextSteps || results?.next_steps)?.[1]?.step || (results?.customNextSteps || results?.next_steps)?.[1] || '',
        next_step_3: (results?.customNextSteps || results?.next_steps)?.[2]?.step || (results?.customNextSteps || results?.next_steps)?.[2] || '',
        next_step_4: (results?.customNextSteps || results?.next_steps)?.[3]?.step || (results?.customNextSteps || results?.next_steps)?.[3] || '',
        
        // Individual resources
        resource_1: results?.recommended_resources?.[0] || '',
        resource_2: results?.recommended_resources?.[1] || '',
        resource_3: results?.recommended_resources?.[2] || '',
        resource_4: results?.recommended_resources?.[3] || '',
        resource_5: results?.recommended_resources?.[4] || '',
        resource_6: results?.recommended_resources?.[5] || '',
        
        // Additional useful fields for marketing
        webinar_offer: 'Music Creator Roadmap Course ($299 value) + Artist Branding Playbook (FREE bonus)',
        webinar_schedule: 'Third Thursday of every month',
        community_size: '1,000+ music creators',
        quiz_completion_time: new Date().toLocaleString('en-US', { 
          timeZone: 'America/Chicago',
          dateStyle: 'medium',
          timeStyle: 'short'
        })
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

    // Send to Go High Level
    if (!process.env.GHL_WEBHOOK_URL) {
      console.warn('⚠️ GHL_WEBHOOK_URL not configured, skipping webhook call');
      return res.status(200).json({ 
        success: true, 
        message: 'Quiz completed successfully (webhook not configured)',
        debug: 'GHL_WEBHOOK_URL environment variable not set'
      });
    }

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

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('❌ GHL webhook failed:', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        error: errorText
      });
      
      // Still return success to user for better UX
      return res.status(200).json({ 
        success: true, 
        message: 'Quiz completed successfully',
        note: 'Results will be sent shortly. If you don\'t receive them, please contact support.',
        debug: process.env.NODE_ENV === 'development' ? `GHL Error: ${errorText}` : undefined
      });
    }

    const ghlResult = await ghlResponse.json();
    console.log('✅ Lead and results submitted successfully to GHL:', { 
      email, 
      pathway: ghlData.pathway,
      customFields: Object.keys(ghlData.custom_fields).length,
      ghlResponse: ghlResult 
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Lead and results submitted successfully',
      data: {
        email,
        pathway: ghlData.pathway,
        hasPersonalizedResults: results?.is_personalized || false,
        submittedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Lead submission error:', error);
    
    // Still return success to user for better UX, but log the error
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for completing the quiz!',
      note: 'If you don\'t receive your results via email, please contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
