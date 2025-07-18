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
    
    // Import PATH_LABELS for display names
    const { PATH_LABELS } = await import('../../lib/quiz/ui.js');

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

    // Detect selected pathways for conditional person messaging
    const detectSelectedPathways = (responses) => {
      const touringAnswers = ['stage-energy', 'performing', 'touring-artist', 'live-performer'];
      const creativeAnswers = ['creative-expression', 'creating-content', 'creative-brand', 'online-audience'];
      const producerAnswers = ['behind-scenes', 'studio-work', 'in-demand-producer', 'songwriter'];
      
      const hasSelectedTouring = Object.values(responses).some(answer => touringAnswers.includes(answer));
      const hasSelectedCreative = Object.values(responses).some(answer => creativeAnswers.includes(answer));
      const hasSelectedProducer = Object.values(responses).some(answer => producerAnswers.includes(answer));
      
      return {
        'touring-performer': hasSelectedTouring,
        'creative-artist': hasSelectedCreative,
        'writer-producer': hasSelectedProducer
      };
    };

    // Prepare data for template
    const selectedPathways = detectSelectedPathways(pathwayData.responses || {});
    const pathwayInfo = {
      'touring-performer': { 
        name: 'Touring Performer', 
        icon: '🎤', 
        color: '#3b82f6',
        description: selectedPathways['touring-performer'] 
          ? 'You live for the stage. The energy of a live audience fuels your soul. You build your legacy one performance at a time.'
          : 'Touring Performers live for the stage. The energy of a live audience fuels their soul. They build their legacy one performance at a time.',
        focusAreas: 'Stage presence, audience connection, live performance skills, touring strategy',
        growthAreas: 'Balance studio time with live performance, maintain authentic social presence, embrace venue opportunities'
      },
      'creative-artist': { 
        name: 'Creative Artist', 
        icon: '🎨', 
        color: '#ec4899',
        description: selectedPathways['creative-artist']
          ? 'You\'re driven to make things — music that moves, content that connects. You don\'t just imagine — you build and share.'
          : 'Creative Artists are driven to make things — music that moves, content that connects. They don\'t just imagine — they build and share.',
        focusAreas: 'Brand development, content creation, digital marketing, revenue diversification',
        growthAreas: 'Stay authentic to your vision, balance content creation with artistic growth, maintain creative focus'
      },
      'writer-producer': { 
        name: 'Writer/Producer', 
        icon: '🎹', 
        color: '#10b981',
        description: selectedPathways['writer-producer']
          ? 'You\'re the builder behind the scenes. You craft the sonic landscapes where others perform. Your art is in the details.'
          : 'Writer-Producers are the builders behind the scenes. They craft the sonic landscapes where others perform. Their art is in the details.',
        focusAreas: 'Production skills, collaboration network, business development, royalty optimization',
        growthAreas: 'Balance solo creativity with collaboration, explore comfortable performance opportunities, build strategic partnerships'
      }
    };
    
    // REMOVED: Old getArchetypeLevel function - scoreResult.levels used exclusively

    // Transform scores into array for handlebars (prefer scoreResult v2 data)
    const scoreData = pathwayData.scoreResult || {};
    const scores = scoreData.displayPct || pathwayData.fuzzyScores || {};
    const levels = scoreData.levels || {};
    const absPct = scoreData.absPct || {};
    
    const fuzzyScoresArray = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([key, percentage], index) => {
        const info = pathwayInfo[key] || { 
          name: key, 
          icon: '🎵', 
          color: '#1DD1A1',
          description: '',
          traits: '',
          shadow: ''
        };
        // Use scoreResult levels exclusively - no fallbacks
        const levelName = levels[key] || 'Noise';
        const archetypeLevel = { 
          level: levelName, 
          icon: levelName === 'Core Focus' ? '🔥' : levelName === 'Strategic Secondary' ? '⚡' : '💫', 
          description: '' 
        };
        const isPrimary = scoreData.recommendation?.path === key || pathwayData.pathwayBlend?.primary === key;
        const isSecondary = index === 1 && !isPrimary;
        
        // Use AI-generated pathway details if available, fallback to default
        const aiPathwayDetails = pathwayData.pathwayDetails || {};
        const pathwayDetail = aiPathwayDetails[key] || {};
        
        return {
          key,
          percentage,
          absolutePercentage: Math.round(absPct[key] || percentage),
          name: PATH_LABELS[key] || info.name,
          icon: info.icon,
          color: info.color,
          description: info.description,
          focusMessage: pathwayDetail.focusMessage || info.description,
          focusAreas: pathwayDetail.focusAreas || info.focusAreas,
          growthAreas: pathwayDetail.growthAreas || info.growthAreas,
          traits: info.traits,
          shadow: info.shadow,
          archetypeLevel: archetypeLevel.level,
          archetypeIcon: archetypeLevel.icon,
          archetypeDescription: archetypeLevel.description,
          isPrimary,
          isSecondary,
          isFirst: index === 0
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

    Handlebars.registerHelper('gte', function(a, b) {
      return a >= b;
    });

    Handlebars.registerHelper('or', function(a, b) {
      return a || b;
    });

    // Generate pathway-specific action items (same logic as in quiz component)
    const generateActionsForStep = (stepTitle, stepIndex, pathway) => {
      const pathwayType = pathway.title ? pathway.title.toLowerCase() : '';
      
      // Touring Performer specific actions
      if (pathwayType.includes('touring') || pathwayType.includes('performer')) {
        const touringActions = [
          [
            "Create a 45-60 minute setlist with strong opening and closing songs",
            "Record yourself performing each song and analyze your stage presence",
            "Book 3 local venue performances within the next 30 days",
            "Study crowd interaction techniques from 5 successful live performers",
            "Develop 2-3 authentic stories to connect songs to your personal journey"
          ],
          [
            "Practice stage movements and microphone technique for 20 minutes daily",
            "Create signature moments in 3 of your strongest songs",
            "Film yourself performing and identify 3 areas for improvement",
            "Research and reach out to 10 venues in your target cities",
            "Develop a pre-show ritual to manage nerves and get in the zone"
          ],
          [
            "Create a professional EPK with high-quality photos and performance videos",
            "Build relationships with 5 local venue owners or booking agents",
            "Set up a system to collect fan contact info at every show",
            "Develop tiered pricing for different venue sizes and markets",
            "Create a 6-month touring plan targeting realistic markets"
          ],
          [
            "Partner with 2-3 artists for joint shows to expand your audience",
            "Research and apply to 3 music festivals in your genre",
            "Hire or partner with a booking agent for larger venues",
            "Create VIP packages and meet-and-greet experiences",
            "Document your touring journey for social media and press"
          ]
        ];
        return touringActions[stepIndex] || touringActions[0];
      }
      
      // Creative Artist specific actions
      else if (pathwayType.includes('creative') || pathwayType.includes('artist')) {
        const creativeActions = [
          [
            "Define your unique artistic voice in one compelling sentence",
            "Create a visual mood board with 20 images representing your brand",
            "Write your origin story and connect it to your music",
            "Identify 3 artists whose careers you want to model",
            "Choose consistent colors, fonts, and visual style for all content"
          ],
          [
            "Plan 30 days of content that shows your creative process",
            "Create content templates for different types of posts",
            "Establish a posting schedule you can maintain long-term",
            "Develop signature content formats your fans will recognize",
            "Set up analytics tracking to understand what resonates"
          ],
          [
            "Launch an email list with exclusive content for subscribers",
            "Create a lead magnet (free song, behind-scenes content, etc.)",
            "Engage meaningfully with 20 potential fans daily on social media",
            "Collaborate with 3 other artists to cross-pollinate audiences",
            "Start a weekly live stream or regular fan interaction format"
          ],
          [
            "Launch merchandise that reflects your brand aesthetic",
            "Create a Patreon or fan subscription with exclusive perks",
            "Develop digital products (sample packs, courses, etc.)",
            "Explore sync licensing opportunities for your music",
            "Build partnerships with brands that align with your values"
          ]
        ];
        return creativeActions[stepIndex] || creativeActions[0];
      }
      
      // Writer-Producer specific actions
      else {
        const producerActions = [
          [
            "Master 3 new production techniques by recreating hit songs",
            "Build custom templates and workflow shortcuts in your DAW",
            "Create a signature sound library with 50+ original samples",
            "Study the arrangement structure of 10 chart-topping songs",
            "Document your production process for consistent results"
          ],
          [
            "Reach out to 5 artists seeking production collaborations",
            "Join 3 producer/songwriter communities online and locally",
            "Offer free production to 2 promising artists to build relationships",
            "Create a portfolio showcasing your range across different genres",
            "Establish clear pricing and contract templates for your services"
          ],
          [
            "Research and submit to music libraries for sync opportunities",
            "Build relationships with A&Rs and music supervisors",
            "Create instrumental versions of your best productions",
            "Develop a system for tracking royalties and publishing splits",
            "Position yourself as the go-to producer for a specific sound/genre"
          ],
          [
            "Submit your best work to relevant music competitions and awards",
            "Create educational content showcasing your production expertise",
            "Mentor emerging artists to build your reputation and network",
            "Explore opportunities to score for film, TV, or games",
            "Build a waitlist of artists wanting to work with you"
          ]
        ];
        return producerActions[stepIndex] || producerActions[0];
      }
    };

    // Add action items to pathway data
    if (pathwayData.pathway && pathwayData.pathway.nextSteps) {
      pathwayData.pathway.nextSteps = pathwayData.pathway.nextSteps.map((step, index) => ({
        ...step,
        actions: generateActionsForStep(step.step, index, pathwayData.pathway)
      }));
    }

    // Prepare template data with scoreResult support
    const rec = pathwayData.scoreResult?.recommendation;
    const topPath = rec?.path || fuzzyScoresArray[0]?.key;
    const topLabel = rec?.promoted ? 'Recommended Focus' : 'Core Focus';
    const topPathName = PATH_LABELS[topPath] || topPath;
    
    const templateData = {
      ...pathwayData,
      fuzzyScoresArray,
      recommendation: pathwayData.scoreResult?.recommendation,
      topLabel,
      topPathName,
      stageLevel: pathwayData.scoreResult?.stageLevel,
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
      format: "A3",
      printBackground: true,
      preferCSSPageSize: false,
      omitBackground: false,
      margin: {
        top: '0px',
        bottom: '0px', 
        left: '0px',
        right: '0px'
      },
      width: '297mm',
      height: '420mm'
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