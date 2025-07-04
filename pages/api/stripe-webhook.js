import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to read raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Sample industry map data - replace with your actual curated list
const INDUSTRY_MAP_DATA = {
  title: "Your Local Music Industry Map",
  description: "10 key companies in your area for strategic networking, partnerships, and career growth",
  companies: [
    {
      name: "Example Recording Studio",
      type: "Recording Studio",
      contact: "studio@example.com",
      phone: "(555) 123-4567",
      website: "https://example-studio.com",
      services: "Recording, Mixing, Mastering",
      notes: "Known for working with emerging artists"
    },
    {
      name: "Local Music Label",
      type: "Record Label",
      contact: "a&r@locallabel.com", 
      phone: "(555) 234-5678",
      website: "https://locallabel.com",
      services: "Artist Development, Distribution",
      notes: "Focus on indie and alternative artists"
    },
    {
      name: "City Venue Group",
      type: "Live Venue",
      contact: "booking@cityvenues.com",
      phone: "(555) 345-6789", 
      website: "https://cityvenues.com",
      services: "Live Shows, Event Hosting",
      notes: "Multiple venues, 50-500 capacity"
    },
    {
      name: "Metro Music Management",
      type: "Artist Management",
      contact: "info@metromgmt.com",
      phone: "(555) 456-7890",
      website: "https://metromgmt.com", 
      services: "Career Management, Booking",
      notes: "Specializes in touring artists"
    },
    {
      name: "Sound Sync Agency",
      type: "Sync Licensing",
      contact: "licensing@soundsync.com",
      phone: "(555) 567-8901",
      website: "https://soundsync.com",
      services: "TV/Film Placement, Advertising",
      notes: "Strong connections with ad agencies"
    },
    {
      name: "Audio Production Co",
      type: "Producer Collective", 
      contact: "collaborate@audioproco.com",
      phone: "(555) 678-9012",
      website: "https://audioproco.com",
      services: "Production, Songwriting, Mixing",
      notes: "Open to collaborations with new artists"
    },
    {
      name: "Digital Music Marketing",
      type: "Marketing Agency",
      contact: "campaigns@digitalmusicmkt.com",
      phone: "(555) 789-0123", 
      website: "https://digitalmusicmkt.com",
      services: "Social Media, PR, Playlist Pitching",
      notes: "Expertise in streaming platform promotion"
    },
    {
      name: "Local Radio Network",
      type: "Radio/Media",
      contact: "programming@localradio.com",
      phone: "(555) 890-1234",
      website: "https://localradio.com", 
      services: "Radio Play, Interviews, Podcasts",
      notes: "Supports local music scene"
    },
    {
      name: "Gear & Tech Rentals",
      type: "Equipment Rental",
      contact: "rentals@geartech.com",
      phone: "(555) 901-2345",
      website: "https://geartech.com",
      services: "Audio Equipment, Instruments, Tech",
      notes: "Competitive rates for regular clients"
    },
    {
      name: "Music Education Hub",
      type: "Educational Services",
      contact: "workshops@musicedhub.com", 
      phone: "(555) 012-3456",
      website: "https://musicedhub.com",
      services: "Music Business Courses, Workshops",
      notes: "Great for networking and skill development"
    }
  ],
  networking_tips: [
    "Start with companies that align with your current career stage",
    "Attend their events before reaching out directly", 
    "Offer value first - don't just ask for help",
    "Follow up consistently but respectfully",
    "Build genuine relationships, not just transactional connections"
  ],
  next_steps: [
    "Research each company's recent projects and artists",
    "Follow their social media and engage with their content",
    "Attend local music events where these contacts might be present",
    "Prepare a concise pitch about yourself and your music",
    "Track your outreach efforts and follow-ups"
  ]
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const buf = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      
      try {
        // Extract customer info
        const customerEmail = session.customer_email || session.customer_details?.email;
        const metadata = session.metadata || {};
        
        console.log('Delivering industry map to:', customerEmail);
        
        // Here you would typically:
        // 1. Save the purchase to your database
        // 2. Send the industry map via email
        // 3. Grant access to a download page
        
        // For now, we'll log the delivery
        console.log('Industry Map delivered to:', {
          email: customerEmail,
          sessionId: session.id,
          amount: session.amount_total / 100,
          metadata: metadata
        });
        
        // You can integrate with email services like:
        // - SendGrid
        // - Mailgun  
        // - Resend
        // - Or your existing email system
        
        await deliverIndustryMap(customerEmail, metadata, session.id);
        
      } catch (error) {
        console.error('Error delivering industry map:', error);
      }
      
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function deliverIndustryMap(email, metadata, sessionId) {
  try {
    // This is where you'd integrate with your email service
    // For example, with SendGrid, Mailgun, or Resend
    
    console.log('Preparing industry map delivery for:', email);
    
    // You could:
    // 1. Send an email with the industry map as PDF attachment
    // 2. Send a link to a secure download page
    // 3. Grant access to a protected area of your site
    
    // Example email content structure:
    const emailContent = {
      to: email,
      subject: "Your Local Music Industry Map - Ready for Download",
      html: generateIndustryMapEmail(metadata),
      attachments: [
        // You could generate a PDF of the industry map here
      ]
    };
    
    console.log('Industry map email prepared for:', email);
    
    // TODO: Integrate with your email service
    // await sendEmail(emailContent);
    
    return true;
  } catch (error) {
    console.error('Error in deliverIndustryMap:', error);
    throw error;
  }
}

function generateIndustryMapEmail(metadata) {
  const pathwayTitle = metadata.pathway_title || 'Your Music Creator Path';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(45deg, #1DD1A1, #B91372); padding: 20px; text-align: center; color: white; }
            .content { padding: 20px; }
            .company { margin-bottom: 20px; padding: 15px; border-left: 4px solid #1DD1A1; background: #f9f9f9; }
            .company-name { font-weight: bold; color: #B91372; font-size: 18px; }
            .company-type { color: #666; font-style: italic; }
            .tips { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎵 Your Local Music Industry Map</h1>
            <p>Strategic networking made simple</p>
        </div>
        
        <div class="content">
            <p>Hi there!</p>
            
            <p>Thank you for your purchase! Based on your assessment results (<strong>${pathwayTitle}</strong>), here's your curated list of 10 local music industry companies to help accelerate your career.</p>
            
            <h2>🎯 Your Strategic Contacts</h2>
            
            ${INDUSTRY_MAP_DATA.companies.map(company => `
                <div class="company">
                    <div class="company-name">${company.name}</div>
                    <div class="company-type">${company.type}</div>
                    <p><strong>Contact:</strong> ${company.contact}</p>
                    <p><strong>Phone:</strong> ${company.phone}</p>
                    <p><strong>Website:</strong> <a href="${company.website}">${company.website}</a></p>
                    <p><strong>Services:</strong> ${company.services}</p>
                    <p><strong>Notes:</strong> ${company.notes}</p>
                </div>
            `).join('')}
            
            <div class="tips">
                <h3>💡 Networking Tips</h3>
                <ul>
                    ${INDUSTRY_MAP_DATA.networking_tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tips">
                <h3>🚀 Next Steps</h3>
                <ol>
                    ${INDUSTRY_MAP_DATA.next_steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <p>Questions? Reply to this email and we'll help you make the most of these connections!</p>
            
            <p>Best of luck with your music career!</p>
            <p><strong>The HOME Team</strong><br>
            <a href="https://homeformusic.app">homeformusic.app</a></p>
        </div>
    </body>
    </html>
  `;
}