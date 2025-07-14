import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, pathwayData } = req.body;

  try {
    console.log('🎨 Starting PDF generation for session:', sessionId);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 1600 });
    
    // Create HTML content directly with all the data
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Music Creator Roadmap</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #000000;
            color: #ffffff;
            line-height: 1.6;
            padding: 32px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 48px;
          }
          
          .logo {
            height: 32px;
            margin-bottom: 32px;
          }
          
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, rgba(29, 209, 161, 0.2) 0%, rgba(185, 19, 114, 0.2) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            margin-bottom: 24px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .title {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
          }
          
          .description {
            color: #d1d5db;
            font-size: 16px;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .section {
            margin-bottom: 48px;
          }
          
          .section-title {
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 32px;
          }
          
          .profile-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .profile-item:last-child {
            border-bottom: none;
          }
          
          .profile-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .profile-icon {
            font-size: 24px;
          }
          
          .profile-name {
            font-size: 16px;
            font-weight: 500;
          }
          
          .profile-right {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          
          .progress-bar {
            width: 150px;
            height: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            overflow: hidden;
          }
          
          .progress-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.3s ease;
          }
          
          .percentage {
            font-size: 16px;
            font-weight: 700;
            min-width: 50px;
            text-align: right;
          }
          
          .roadmap-step {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
          }
          
          .step-number {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #1DD1A1 0%, #B91372 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            flex-shrink: 0;
          }
          
          .step-content {
            flex: 1;
          }
          
          .step-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .step-detail {
            color: #d1d5db;
            font-size: 14px;
            line-height: 1.5;
          }
          
          .detail-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
          }
          
          .detail-box-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .action-item {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            align-items: flex-start;
          }
          
          .action-check {
            color: #1DD1A1;
            font-size: 18px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          
          .action-text {
            color: #d1d5db;
            font-size: 14px;
            line-height: 1.5;
          }
          
          .home-connection {
            background: linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(185, 19, 114, 0.1) 100%);
            border: 1px solid rgba(29, 209, 161, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 48px;
          }
          
          .footer {
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            margin-top: 64px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <img src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png" alt="HOME" class="logo">
            <div class="badge">
              ✨ Your Music Creator Roadmap ✨
            </div>
            <h1 class="title">${pathwayData.pathway?.title || 'Your Music Creator Path'}</h1>
            <p class="description">${pathwayData.pathway?.description || ''}</p>
          </div>
          
          <!-- Creative Profile -->
          <div class="section">
            <h2 class="section-title">Your Creative Profile</h2>
            <div>
              ${Object.entries(pathwayData.fuzzyScores || {})
                .sort((a, b) => b[1] - a[1])
                .map(([key, percentage]) => {
                  const info = {
                    'touring-performer': { name: 'Touring Performer', icon: '🎤', color: '#3b82f6' },
                    'creative-artist': { name: 'Creative Artist', icon: '🎨', color: '#ec4899' },
                    'writer-producer': { name: 'Writer/Producer', icon: '🎹', color: '#10b981' }
                  }[key] || { name: key, icon: '🎵', color: '#1DD1A1' };
                  
                  return `
                    <div class="profile-item">
                      <div class="profile-left">
                        <span class="profile-icon">${info.icon}</span>
                        <span class="profile-name">${info.name}</span>
                      </div>
                      <div class="profile-right">
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${percentage}%; background: ${info.color};"></div>
                        </div>
                        <span class="percentage">${percentage}%</span>
                      </div>
                    </div>
                  `;
                }).join('')}
            </div>
          </div>
          
          <!-- Strategic Roadmap -->
          <div class="section">
            <h2 class="section-title">Your Strategic Roadmap</h2>
            ${(pathwayData.pathway?.nextSteps || []).slice(0, 4).map((step, index) => `
              <div class="roadmap-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                  <h3 class="step-title">${step.step}</h3>
                  <p class="step-detail">${step.detail}</p>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Detailed Action Steps -->
          ${(pathwayData.pathway?.nextSteps || []).map((step, index) => `
            <div class="section">
              <h2 class="section-title">Step ${index + 1}: ${step.step}</h2>
              
              <div class="detail-box">
                <h3 class="detail-box-title">
                  <span style="color: #B91372;">✨</span>
                  Why This Matters
                </h3>
                <p style="color: #d1d5db;">${step.detail}</p>
              </div>
              
              <div class="detail-box">
                <h3 class="detail-box-title">
                  <span style="color: #1DD1A1;">🎯</span>
                  Your Action Items
                </h3>
                ${[
                  step.step,
                  'Set specific, measurable goals for this step',
                  'Connect with others who have succeeded in this area',
                  'Document your progress and learnings',
                  'Track results and optimize your approach'
                ].map(action => `
                  <div class="action-item">
                    <span class="action-check">✓</span>
                    <span class="action-text">${action}</span>
                  </div>
                `).join('')}
              </div>
              
              <div class="detail-box">
                <h3 class="detail-box-title">
                  <img src="https://storage.googleapis.com/msgsndr/G9A67p2EOSXq4lasgzDq/media/68642fe27345d7e21658ea3b.png" alt="HOME" style="height: 20px;">
                  HOME Resources
                </h3>
                ${(pathwayData.pathway?.resources || []).slice(0, 3).map(resource => `
                  <div style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 8px; margin-bottom: 8px;">
                    ${resource}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          
          <!-- HOME Connection -->
          ${pathwayData.pathway?.homeConnection ? `
            <div class="section">
              <h2 class="section-title">Your HOME Connection</h2>
              <div class="home-connection">
                <p>${pathwayData.pathway.homeConnection}</p>
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p style="margin-top: 8px;">homeformusic.app</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Set content directly
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    
    // Send PDF
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
};