import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, pathwayData } = req.body;

  try {
    console.log('🎨 Starting PDF generation for session:', sessionId);
    
    // Launch Puppeteer with Vercel-compatible settings
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });
    
    // Navigate to the PDF view page
    const pdfUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pdf/${sessionId}`;
    console.log('📄 Navigating to:', pdfUrl);
    
    await page.goto(pdfUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait a bit for any animations to settle
    await page.waitForTimeout(2000);
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully');
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="music-creator-roadmap-${sessionId}.pdf"`);
    res.send(pdf);
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  }
}

// Increase timeout for PDF generation
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
};