import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id, pdf_session } = req.query;

  try {
    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    console.log('🎨 Starting PDF generation for paid session:', pdf_session);
    
    // In a real app, you'd retrieve the PDF data from your database
    // For now, we'll create a simple fallback since localStorage is client-side
    // The client should have included the pathway data in the Stripe metadata
    
    const customerEmail = session.customer_email || session.customer_details?.email;
    const metadata = session.metadata || {};
    
    // Create pathway-specific PDF data based on Stripe metadata
    const primaryPath = metadata.primaryPath || 'creative-artist';
    const pathwayTitle = metadata.pathwayTitle || 'Your Music Creator Path';
    const artistName = metadata.artistName || 'Music Creator';
    
    // Generate pathway-specific content
    const pathwayContent = {
      'touring-performer': {
        title: 'The Touring Performer Path',
        description: 'Your roadmap to building a successful live performance career',
        nextSteps: [
          { step: 'Build a powerful 45-60 minute setlist that showcases your range', priority: 'high' },
          { step: 'Develop your stage presence through regular performance opportunities', priority: 'high' },
          { step: 'Create a professional EPK to pitch to venues and booking agents', priority: 'medium' },
          { step: 'Network with booking professionals and venue owners in your scene', priority: 'medium' }
        ],
        resources: [
          'Rehearsal Facility Access (24/7 at HOME)',
          'Live Sound & Performance Equipment',
          'Stage Presence Coaching Sessions',
          'Booking Strategy & Agent Connections',
          'Professional Photography & Video',
          'Tour Planning & Management Tools'
        ]
      },
      'creative-artist': {
        title: 'The Creative Artist Path',
        description: 'Your roadmap to building a sustainable creative brand and audience',
        nextSteps: [
          { step: 'Define your unique artistic voice and visual brand identity', priority: 'high' },
          { step: 'Create a content strategy that showcases your creative process', priority: 'high' },
          { step: 'Develop multiple revenue streams: streaming, merchandise, content', priority: 'medium' },
          { step: 'Build an authentic community around your art through storytelling', priority: 'medium' }
        ],
        resources: [
          'Content Creation Studios & Equipment',
          'Brand Development & Visual Design',
          'Social Media Strategy & Management',
          'Revenue Diversification Coaching',
          'Video Production & Editing Tools',
          'Artist Community & Collaboration Network'
        ]
      },
      'writer-producer': {
        title: 'The Writer-Producer Path',
        description: 'Your roadmap to building a successful production and songwriting career',
        nextSteps: [
          { step: 'Master your DAW and develop a signature production style', priority: 'high' },
          { step: 'Build a diverse portfolio showcasing your range across genres', priority: 'high' },
          { step: 'Network with artists, labels, and music supervisors', priority: 'medium' },
          { step: 'Learn the business side: publishing, sync licensing, contracts', priority: 'medium' }
        ],
        resources: [
          'Professional Recording Studios (24/7 access)',
          'Industry-Standard Production Equipment',
          'Collaboration Network & Artist Connections',
          'Music Business & Publishing Education',
          'Sync Licensing & Placement Opportunities',
          'Technical Skill Development Programs'
        ]
      }
    };
    
    const pathwayInfo = pathwayContent[primaryPath] || pathwayContent['creative-artist'];
    
    const pdfData = {
      pathway: {
        title: pathwayInfo.title,
        description: pathwayInfo.description,
        nextSteps: pathwayInfo.nextSteps,
        resources: pathwayInfo.resources,
        homeConnection: `HOME's professional facilities and community of 1,500+ creators provide the perfect environment to accelerate your ${primaryPath.replace('-', ' ')} career. Join our monthly webinar to learn the exact strategies our successful artists use.`
      },
      responses: {
        email: customerEmail
      },
      scoreResult: {
        recommendation: { path: primaryPath },
        stageLevel: 'developing',
        blendType: 'focused'
      },
      fuzzyScores: {
        [primaryPath]: 50,
        'creative-artist': primaryPath === 'creative-artist' ? 50 : 25,
        'touring-performer': primaryPath === 'touring-performer' ? 50 : 25,
        'writer-producer': primaryPath === 'writer-producer' ? 50 : 25
      },
      pathwayBlend: {
        type: 'focused',
        primary: primaryPath
      },
      artistName: artistName
    };
    
    console.log('📄 Generating PDF using internal API...');
    
    // Use our existing generate-pdf API
    const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: pdf_session,
        pathwayData: pdfData
      }),
    });
    
    if (!pdfResponse.ok) {
      throw new Error(`PDF generation failed: ${pdfResponse.status}`);
    }
    
    const pdfBuffer = await pdfResponse.buffer();
    
    console.log('✅ PDF generated successfully');
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="music-creator-roadmap-${pdf_session}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
};