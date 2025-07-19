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

    // Extract scoring data if available
    const scoreResult = results?.scoreResult || {};
    const pathwayDetails = results?.pathwayDetails || {};
    const primaryPath = scoreResult?.recommendation?.path || pathway;
    const levels = scoreResult?.levels || {};
    
    // Determine pathway names
    const pathwayNames = {
      'touring-performer': 'Performer',
      'creative-artist': 'Creative',
      'writer-producer': 'Producer'
    };
    
    // Create a flat webhook data structure that GHL can easily parse
    const webhookData = {
      // Core fields
      email: email,
      pathway: pathwayNames[primaryPath] || 'Unknown',
      pathway_name: pathwayNames[primaryPath] || 'Unknown',
      pathway_focus_level: levels[primaryPath] === 'Core Focus' ? 'Core' : 'Recommended',
      source: source || 'music-creator-roadmap-quiz',
      
      // Individual response fields (flat structure for GHL)
      ideal_day: responses?.['ideal-day'] || '',
      motivation: responses?.motivation || '',
      stage_level: responses?.['stage-level'] || 'planning',
      success_vision: responses?.['success-vision'] || '',
      resource_priority: responses?.['resources-priority'] || '',
      
      // Results fields
      pathway_icon: results?.icon || '🎵',
      pathway_description: results?.description || '',
      home_connection: results?.homeConnection || '',
      is_personalized: results?.isPersonalized ? 'Yes' : 'No',
      assistant_used: results?.assistantUsed ? 'Yes' : 'No',
      
      // Primary pathway details
      primary_focus_message: pathwayDetails[primaryPath]?.focusMessage || '',
      primary_focus_areas: pathwayDetails[primaryPath]?.focusAreas || '',
      primary_growth_areas: pathwayDetails[primaryPath]?.growthAreas || '',
      
      // Secondary pathway details (if exists)
      secondary_pathway_card: generateSecondaryCard(scoreResult, pathwayDetails, pathwayNames),
      
      // Noise pathway details (if exists)
      noise_pathway_card: generateNoiseCard(scoreResult, pathwayDetails, pathwayNames),
      
      // Formatted fields
      quiz_completed_date: new Date().toISOString(),
      quiz_completion_time: new Date().toLocaleString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      timestamp: new Date().toISOString(),
      
      // Next steps as simple text
      next_steps_formatted: formatNextSteps(results?.nextSteps || []),
      
      // Resources as simple text
      recommended_resources_formatted: formatResources(results?.resources || []),
      
      // All responses as one field for backup
      quiz_responses: formatResponses(responses),
      
      // Additional fields for email template
      webinar_offer: 'Free 30-minute Music Career Accelerator Workshop',
      webinar_schedule: 'Every Tuesday at 7pm CST',
      community_size: '1000+'
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
function generateSecondaryCard(scoreResult, pathwayDetails, pathwayNames) {
  if (!scoreResult?.levels) return '';
  
  // Find secondary pathway (has 'Strategic Secondary' level)
  const secondaryPath = Object.entries(scoreResult.levels)
    .find(([path, level]) => level === 'Strategic Secondary')?.[0];
  
  if (!secondaryPath || !pathwayDetails[secondaryPath]) return '';
  
  const pathwayIcons = {
    'touring-performer': '🎤',
    'creative-artist': '🎨',
    'writer-producer': '🎹'
  };
  
  return `
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-icon">${pathwayIcons[secondaryPath] || '🎵'}</div>
        <div class="profile-info">
          <div class="profile-name">
            ${pathwayNames[secondaryPath] || secondaryPath}
            <span class="focus-badge secondary">⚡ SECONDARY</span>
          </div>
        </div>
      </div>
      <p class="profile-description">${pathwayDetails[secondaryPath].focusMessage || ''}</p>
      <p class="profile-level-info">This complements your primary focus. These skills can enhance your main path when developed strategically. Consider integrating these elements to create a more well-rounded approach.</p>
      <div class="profile-details">
        <div class="detail-row">
          <div class="detail-label">🎯 Focus Areas:</div>
          <div class="detail-text">${pathwayDetails[secondaryPath].focusAreas || ''}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">📈 Growth Areas:</div>
          <div class="detail-text">${pathwayDetails[secondaryPath].growthAreas || ''}</div>
        </div>
      </div>
    </div>
  `;
}

function generateNoiseCard(scoreResult, pathwayDetails, pathwayNames) {
  if (!scoreResult?.levels) return '';
  
  // Find noise pathway (has 'Noise' level)
  const noisePath = Object.entries(scoreResult.levels)
    .find(([path, level]) => level === 'Noise')?.[0];
  
  if (!noisePath || !pathwayDetails[noisePath]) return '';
  
  const pathwayIcons = {
    'touring-performer': '🎤',
    'creative-artist': '🎨',
    'writer-producer': '🎹'
  };
  
  return `
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-icon">${pathwayIcons[noisePath] || '🎵'}</div>
        <div class="profile-info">
          <div class="profile-name">
            ${pathwayNames[noisePath] || noisePath}
            <span class="focus-badge noise">· NOISE</span>
          </div>
        </div>
      </div>
      <p class="profile-description">${pathwayDetails[noisePath].focusMessage || ''}</p>
    </div>
  `;
}

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
