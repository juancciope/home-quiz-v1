import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, pathwayData } = req.body;

  try {
    console.log('🎨 Starting PDF generation for session:', sessionId);
    
    // Launch Puppeteer with serverless Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });
    
    // Navigate to the PDF view page with data as query parameter
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000');
    
    // Encode the pathway data as base64 to pass in URL
    const encodedData = Buffer.from(JSON.stringify(pathwayData)).toString('base64');
    const pdfUrl = `${baseUrl}/pdf/${sessionId}?data=${encodeURIComponent(encodedData)}`;
    console.log('📄 Navigating to:', pdfUrl);
    
    await page.goto(pdfUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for content and styling to load
    await page.waitForFunction(() => {
      const container = document.querySelector('.pdf-container');
      const mainTitle = document.querySelector('.main-title');
      const computedStyle = window.getComputedStyle(document.body);
      return container && mainTitle && (computedStyle.backgroundColor === 'rgb(0, 0, 0)' || computedStyle.color === 'rgb(255, 255, 255)');
    }, { timeout: 15000 }).catch(() => {
      console.log('Content/styling timeout, proceeding anyway...');
    });
    
    // Additional wait for complete rendering
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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