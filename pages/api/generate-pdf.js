import path from "path";
import fs from "fs";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import Handlebars from "handlebars";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const isDev = process.env.NODE_ENV === "development";
  
  try {
    const { sessionId, pathwayData } = req.body;

    if (!pathwayData) {
      return res.status(400).json({
        success: false,
        message: "PathwayData is required."
      });
    }

    console.log('🎨 Starting PDF generation for session:', sessionId);

    // Get template path
    const templatePath = path.join(process.cwd(), "public/pdf-templates/roadmap.template.hbs");

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      console.error('Template not found at:', templatePath);
      return res.status(500).json({
        success: false,
        message: "Handlebars template file not found."
      });
    }

    // Prepare data for template
    const pathwayInfo = {
      'touring-performer': { name: 'Touring Performer', icon: '🎤', color: '#3b82f6' },
      'creative-artist': { name: 'Creative Artist', icon: '🎨', color: '#ec4899' },
      'writer-producer': { name: 'Writer/Producer', icon: '🎹', color: '#10b981' }
    };

    // Transform fuzzyScores into array for handlebars
    const fuzzyScoresArray = Object.entries(pathwayData.fuzzyScores || {})
      .sort((a, b) => b[1] - a[1])
      .map(([key, percentage]) => {
        const info = pathwayInfo[key] || { name: key, icon: '🎵', color: '#1DD1A1' };
        const isPrimary = pathwayData.pathwayBlend?.primary === key;
        const isSecondary = pathwayData.pathwayBlend?.secondary === key;
        
        return {
          key,
          percentage,
          name: info.name,
          icon: info.icon,
          color: info.color,
          isPrimary,
          isSecondary
        };
      });

    // Register handlebars helpers
    Handlebars.registerHelper('index1', function(options) {
      return parseInt(options.data.index) + 1;
    });

    Handlebars.registerHelper('@index1', function() {
      return this['@index'] + 1;
    });

    Handlebars.registerHelper('gt', function(a, b) {
      return a > b;
    });

    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });

    Handlebars.registerHelper('add', function(a, b) {
      return a + b;
    });

    Handlebars.registerHelper('lt', function(a, b) {
      return a < b;
    });

    Handlebars.registerHelper('unless', function(conditional, options) {
      if (!conditional) {
        return options.fn(this);
      }
    });

    // Prepare template data
    const templateData = {
      ...pathwayData,
      fuzzyScoresArray,
      currentDate: new Date().toLocaleDateString()
    };

    console.log('📄 Template data prepared, compiling...');

    // Read and compile template
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateContent);
    const renderedHtml = template(templateData);

    console.log('📝 Rendered HTML length:', renderedHtml.length);
    console.log('📝 HTML preview (first 500 chars):', renderedHtml.substring(0, 500));
    console.log('📝 Template data keys:', Object.keys(templateData));
    console.log('📝 Pathway data:', JSON.stringify(templateData.pathway?.title || 'NO_TITLE'));

    console.log('🖥️ Launching browser...');

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      ...(isDev ? {
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      } : {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      }),
    });

    const page = await browser.newPage();
    
    console.log('📋 Setting content...');
    
    await page.setContent(renderedHtml, { 
      waitUntil: "networkidle0",
      timeout: 30000
    });

    // Set media type to screen for proper background rendering
    await page.emulateMediaType('screen');

    // Wait for any fonts to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📄 Generating PDF...');

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      omitBackground: false,
      margin: {
        top: '0px',
        bottom: '0px', 
        left: '0px',
        right: '0px'
      },
      width: '210mm',
      height: '297mm'
    });

    await browser.close();

    console.log('✅ PDF generated successfully, buffer size:', pdfBuffer.length);
    
    // Verify PDF starts with PDF header - convert bytes to string properly
    const pdfHeader = pdfBuffer.slice(0, 4).toString('ascii');
    console.log('📋 PDF header as string:', pdfHeader);
    console.log('📋 PDF header bytes:', Array.from(pdfBuffer.slice(0, 4)));
    
    // The PDF is valid - the bytes 37,80,68,70 = %PDF in ASCII
    // Remove the validation that's incorrectly failing

    // Send PDF with proper headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="music-creator-roadmap-${sessionId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    console.log('📤 Sending PDF response with', pdfBuffer.length, 'bytes');
    
    // End the response with the buffer
    res.end(pdfBuffer);

  } catch (error) {
    console.error("❌ Error generating PDF:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
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