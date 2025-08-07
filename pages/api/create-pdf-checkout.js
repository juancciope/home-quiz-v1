import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, email, pathwayData } = req.body;
    
    console.log('🔍 Create PDF checkout called with:', {
      sessionId,
      email,
      hasPathwayData: !!pathwayData,
      pathwayTitle: pathwayData?.pathway?.title
    });

    // Use price ID if available, otherwise create dynamic pricing
    const usePreCreatedPrice = !!process.env.STRIPE_PDF_PRICE_ID;
    console.log(`💰 Using ${usePreCreatedPrice ? 'pre-created price ID' : 'dynamic pricing'}:`, 
      usePreCreatedPrice ? process.env.STRIPE_PDF_PRICE_ID : '$20 USD dynamic');
    
    const lineItems = usePreCreatedPrice ? [
      {
        price: process.env.STRIPE_PDF_PRICE_ID, // Use your pre-created price
        quantity: 1,
      },
    ] : [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Music Creator Roadmap PDF',
            description: 'Your personalized music career roadmap with detailed action steps',
          },
          unit_amount: 2000, // $20.00
        },
        quantity: 1,
      },
    ];

    // Create Stripe checkout session for PDF
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?payment_success=true&session_id={CHECKOUT_SESSION_ID}&pdf_session=${sessionId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      customer_email: email,
      metadata: {
        pdfSessionId: sessionId,
        pathwayTitle: pathwayData?.pathway?.title || 'Music Creator Path',
        artistName: pathwayData?.artistName || '',
        primaryPath: pathwayData?.pathwayBlend?.primary || 'creative-artist',
        email: email
      }
    });

    console.log('✅ Stripe checkout session created:', {
      sessionId: session.id,
      url: session.url
    });
    
    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Stripe checkout error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack?.substring(0, 300)
    });
    res.status(500).json({ 
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
}