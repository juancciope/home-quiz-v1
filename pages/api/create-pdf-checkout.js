import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, email, pathwayData } = req.body;

    // Use product ID if available, otherwise create dynamic pricing
    const lineItems = process.env.STRIPE_PDF_PRODUCT_ID ? [
      {
        price: process.env.STRIPE_PDF_PRODUCT_ID, // Use your pre-created product
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
      success_url: `${process.env.NEXT_PUBLIC_URL}/api/download-pdf?session_id={CHECKOUT_SESSION_ID}&pdf_session=${sessionId}`,
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

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}