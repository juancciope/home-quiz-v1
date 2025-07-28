/**
 * Beehive API Integration
 * Handles subscriber enrollment in automation sequences
 */

const BEEHIVE_API_BASE = 'https://api.beehiiv.com/v2';

/**
 * Add existing subscription to automation
 */
async function addToAutomation(email, publicationId, automationId) {
  const url = `${BEEHIVE_API_BASE}/publications/${publicationId}/automations/${automationId}/journeys`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BEEHIVE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      double_opt_override: 'on'
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Beehive automation enrollment failed: ${data.message || response.statusText}`);
  }
  
  return data;
}

/**
 * Create new subscription and enroll in automation
 */
async function createSubscriptionWithAutomation(email, publicationId, automationId, additionalData = {}) {
  const url = `${BEEHIVE_API_BASE}/publications/${publicationId}/subscriptions`;
  
  const payload = {
    email: email,
    utm_source: additionalData.utm_source || 'music-creator-quiz',
    utm_medium: additionalData.utm_medium || 'organic',
    utm_campaign: additionalData.utm_campaign || 'creator-roadmap',
    referring_site: additionalData.referring_site || 'homeformusic.app'
  };
  
  // Add custom fields if provided
  if (additionalData.customFields && additionalData.customFields.length > 0) {
    payload.custom_fields = additionalData.customFields;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BEEHIVE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Beehive subscription creation failed: ${data.message || response.statusText}`);
  }
  
  // After successful subscription creation, enroll in automation
  try {
    await addToAutomation(email, publicationId, automationId);
    console.log('✅ Successfully enrolled new subscriber in automation');
  } catch (automationError) {
    console.warn('⚠️ Subscription created but automation enrollment failed:', automationError.message);
    // Don't fail the entire process if automation fails
  }
  
  return data;
}

/**
 * Main function to enroll user in Beehive automation
 * Tries to add existing subscriber first, if that fails, creates new subscription
 */
export async function enrollInBeehiveAutomation(email, userProfile = {}) {
  const publicationId = process.env.BEEHIVE_PUBLICATION_ID;
  const automationId = process.env.BEEHIVE_AUTOMATION_ID;
  
  if (!process.env.BEEHIVE_API_KEY || !publicationId || !automationId) {
    console.warn('⚠️ Beehive not configured - skipping enrollment');
    return { success: false, reason: 'not_configured' };
  }
  
  console.log('🐝 Attempting to enroll in Beehive automation:', email);
  
  try {
    // First, try to add existing subscriber to automation
    console.log('🔄 Trying to add existing subscriber to automation...');
    const automationResult = await addToAutomation(email, publicationId, automationId);
    
    console.log('✅ Successfully enrolled existing subscriber in automation');
    return {
      success: true,
      method: 'existing_subscriber',
      data: automationResult
    };
    
  } catch (automationError) {
    console.log('📝 Subscriber not found, creating new subscription...');
    
    try {
      // Prepare custom fields based on user profile
      const customFields = [];
      
      if (userProfile.pathway) {
        customFields.push({
          name: 'Music Creator Path',
          value: userProfile.pathway
        });
      }
      
      if (userProfile.stage) {
        customFields.push({
          name: 'Career Stage',
          value: userProfile.stage
        });
      }
      
      if (userProfile.primaryFocus) {
        customFields.push({
          name: 'Primary Focus',
          value: userProfile.primaryFocus
        });
      }
      
      // Create new subscription with automation enrollment
      const subscriptionResult = await createSubscriptionWithAutomation(
        email, 
        publicationId, 
        automationId,
        {
          utm_source: userProfile.utm_source || 'music-creator-quiz',
          utm_medium: userProfile.utm_medium || 'organic',
          utm_campaign: userProfile.utm_campaign || 'creator-roadmap',
          referring_site: userProfile.referring_site || 'homeformusic.app',
          customFields: customFields
        }
      );
      
      console.log('✅ Successfully created subscription and enrolled in automation');
      return {
        success: true,
        method: 'new_subscriber',
        data: subscriptionResult
      };
      
    } catch (subscriptionError) {
      console.error('❌ Failed to create subscription:', subscriptionError);
      return {
        success: false,
        reason: 'creation_failed',
        error: subscriptionError.message
      };
    }
  }
}

export default enrollInBeehiveAutomation;