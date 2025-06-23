export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, pathway, responses, source } = req.body;
    
    // Validate required fields
    if (!email || !pathway) {
      return res.status(400).json({ message: 'Email and pathway are required' });
    }

    // Prepare data for GHL
    const ghlData = {
      email,
      source: source || 'music-creator-roadmap-quiz',
      pathway,
      tags: [
        'quiz-completed',
        `pathway-${pathway.toLowerCase().replace(/\s+/g, '-').replace('the-', '')}`,
        `stage-${responses?.['stage-level'] || 'unknown'}`
      ],
      custom_fields: {
        motivation: responses?.motivation,
        ideal_day: responses?.['ideal-day'],
        success_vision: responses?.['success-vision'],
        stage_level: responses?.['stage-level'],
        resource_priority: responses?.['resources-priority'],
        quiz_completed_date: new Date().toISOString()
      }
    };

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
      console.error('GHL webhook failed:', errorText);
      throw new Error(`GHL webhook failed: ${ghlResponse.status}`);
    }

    // Log success for monitoring
    console.log('Lead submitted successfully:', { email, pathway });
    
    res.status(200).json({ success: true, message: 'Lead submitted successfully' });
  } catch (error) {
    console.error('Lead submission error:', error);
    
    // Return success to user even if backend fails (better UX)
    // Log the error for debugging
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for completing the quiz!',
      note: 'If you don\'t receive emails, please contact support.'
    });
  }
}