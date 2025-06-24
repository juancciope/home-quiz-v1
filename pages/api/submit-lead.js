export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, pathway, responses, source, results } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Format next steps for email template
    const formatNextSteps = (steps) => {
      if (!steps || !Array.isArray(steps)) return '';
      
      return steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
    };

    // Format recommended resources for email template
    const formatResources = (resources) => {
      if (!resources || !Array.isArray(resources)) return '';
      
      return resources.map(resource => `• ${resource}`).join('\n');
    };

    // Prepare comprehensive data for GHL
    const ghlData = {
      email,
      source: source || 'music-creator-roadmap-quiz',
      pathway: pathway || 'Unknown',
      tags: [
        'quiz-completed',
        `pathway-${(pathway || 'unknown').toLowerCase().replace(/\s+/g, '-').replace('the-', '')}`,
        `stage-${responses?.['stage-level'] || 'unknown'}`
      ],
      custom_fields: {
        // Original quiz responses
        motivation: responses?.motivation || '',
        ideal_day: responses?.['ideal-day'] || '',
        success_vision: responses?.['success-vision'] || '',
        stage_level: responses?.['stage-level'] || '',
        resource_priority: responses?.['resources-priority'] || '',
        quiz_completed_date: new Date().toISOString(),
        
        // Detailed results for email templates
        pathway_title: results?.pathway_title || pathway || '',
        pathway_description: results?.pathway_description || '',
        pathway_icon: results?.pathway_icon || '',
        home_connection: results?.home_connection || '',
        is_personalized: results?.is_personalized || false,
        
        // Formatted content for email templates
        next_steps_formatted: formatNextSteps(results?.next_steps),
        recommended_resources_formatted: formatResources(results?.recommended_resources),
        
        // Raw arrays for advanced email builders
        next_steps_array: JSON.stringify(results?.next_steps || []),
        recommended_resources_array: JSON.stringify(results?.recommended_resources || []),
        
        // Additional useful fields
        webinar_offer: 'Music Creator Roadmap Course ($299 value) + Artist Branding Playbook (FREE bonus)',
        webinar_schedule: 'Third Thursday of every month',
        community_size: '1,000+ music creators'
      }
    };

    console.log('Sending comprehensive lead data to GHL:', {
      email,
      pathway: ghlData.pathway,
      tags: ghlData.tags,
      hasResults: !!results,
      nextStepsCount: results?.next_steps?.length || 0,
      resourcesCount: results?.recommended_resources?.length || 0
    });

    // Send to Go High Level
    const ghlResponse = await fetch(process.env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ghlData)
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GHL webhook failed:', {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        error: errorText
      });
      throw new Error(`GHL webhook failed: ${ghlResponse.status}`);
    }

    const ghlResult = await ghlResponse.json();
    console.log('✅ Lead submitted successfully to GHL:', { 
      email, 
      pathway: ghlData.pathway,
      ghlResponse: ghlResult 
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Lead and results submitted successfully',
      data: {
        email,
        pathway: ghlData.pathway,
        hasPersonalizedResults: results?.is_personalized || false
      }
    });
    
  } catch (error) {
    console.error('❌ Lead submission error:', error);
    
    // Still return success to user for better UX, but log the error
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for completing the quiz!',
      note: 'If you don\'t receive emails, please contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
