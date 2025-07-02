// Main handler function
export default async function handler(req, res) {
  console.log('🔔 SUBMIT-LEAD API CALLED');
  console.log('🔔 Method:', req.method);
  console.log('🔔 Body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, pathway, responses, source, results } = req.body;
    
    // Basic validation
    if (!email) {
      console.error('❌ No email provided');
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    console.log('📧 Processing lead for:', email);
    console.log('🎯 Pathway:', pathway);
    console.log('📝 Responses:', responses);
    console.log('📊 Results:', results);

    // Create a flat webhook data structure that GHL can easily parse
    const webhookData = {
      // Core fields
      email: email,
      pathway: results?.title || pathway || 'Unknown Pathway',
      source: source || 'music-creator-roadmap-quiz',
      
      // Individual response fields (flat structure for GHL)
      ideal_day: responses?.['ideal-day'] || '',
      motivation: responses?.motivation || '',
      stage_level: responses?.['stage-level'] || '',
      success_vision: responses?.['success-vision'] || '',
      resource_priority: responses?.['resources-priority'] || '',
      
      // Results fields
      pathway_icon: results?.icon || '🎵',
      pathway_description: results?.description || '',
      home_connection: results?.homeConnection || '',
      is_personalized: results?.isPersonalized ? 'Yes' : 'No',
      assistant_used: results?.assistantUsed ? 'Yes' : 'No',
      
      // Formatted fields
      quiz_completed_date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      
      // Next steps as simple text
      next_steps_formatted: formatNextSteps(results?.nextSteps || []),
      
      // Resources as simple text
      recommended_resources_formatted: formatResources(results?.resources || []),
      
      // All responses as one field for backup
      quiz_responses: formatResponses(responses)
    };

    console.log('📤 Webhook data prepared:', JSON.stringify(webhookData, null, 2));

    // Send to GHL webhook
    if (process.env.GHL_WEBHOOK_URL) {
      try {
        console.log('🚀 Sending to GHL webhook...');
        const ghlResponse = await fetch(process.env.GHL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(webhookData)
        });
        
        const responseText = await ghlResponse.text();
        console.log('📨 GHL Response Status:', ghlResponse.status);
        console.log('📨 GHL Response Text:', responseText);
        
        if (!ghlResponse.ok) {
          console.error('❌ GHL webhook failed:', ghlResponse.status, responseText);
        } else {
          console.log('✅ GHL webhook success');
        }
      } catch (error) {
        console.error('❌ GHL webhook error:', error);
      }
    } else {
      console.warn('⚠️ GHL_WEBHOOK_URL not configured');
    }

    // Always return success to the frontend
    res.status(200).json({ 
      success: true,
      message: 'Lead processed successfully',
      email: email
    });
    
  } catch (error) {
    console.error('❌ Submit lead error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process lead',
      error: error.message 
    });
  }
}

// Helper functions
function formatNextSteps(steps) {
  if (!steps || !Array.isArray(steps)) return 'No steps provided';
  
  return steps.map((step, index) => {
    if (typeof step === 'string') {
      return `${index + 1}. ${step}`;
    } else if (step.step) {
      const detail = step.detail ? `\n   → ${step.detail}` : '';
      return `${index + 1}. ${step.step}${detail}`;
    }
    return '';
  }).filter(Boolean).join('\n\n');
}

function formatResources(resources) {
  if (!resources || !Array.isArray(resources)) return 'Standard HOME Resources';
  return resources.map((resource, index) => `${index + 1}. ${resource}`).join('\n');
}

function formatResponses(responses) {
  if (!responses) return '';
  return Object.entries(responses)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}
