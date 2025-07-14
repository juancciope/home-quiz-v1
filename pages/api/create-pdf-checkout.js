import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, email } = req.body;

    // Create Stripe checkout session for PDF
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Music Creator Roadmap PDF',
              description: 'Your personalized music career roadmap with detailed action steps',
            },
            unit_amount: 3000, // $30.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/api/download-pdf?session_id={CHECKOUT_SESSION_ID}&pdf_session=${sessionId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      customer_email: email,
      metadata: {
        pdfSessionId: sessionId
      }
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}