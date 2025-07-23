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
    console.log('🔍 PDF data validation:', {
      hasPathwayData: !!pathwayData,
      hasPathway: !!pathwayData.pathway,
      pathwayTitle: pathwayData.pathway?.title,
      hasPathwayDetails: !!pathwayData.pathwayDetails,
      pathwayDetailsKeys: Object.keys(pathwayData.pathwayDetails || {}),
      hasScoreResult: !!pathwayData.scoreResult,
      scoreResultValid: !!(pathwayData.scoreResult?.levels && pathwayData.scoreResult?.displayPct),
      hasFuzzyScores: !!(pathwayData.fuzzyScores && Object.keys(pathwayData.fuzzyScores).length > 0)
    });

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

    // Path metadata - icons and colors only (content comes from AI)
    const pathwayInfo = {
      'touring-performer': { 
        name: 'Touring Performer', 
        icon: '🎤', 
        color: '#3b82f6'
      },
      'creative-artist': { 
        name: 'Creative Artist', 
        icon: '🎨', 
        color: '#ec4899'
      },
      'writer-producer': { 
        name: 'Writer/Producer', 
        icon: '🎹', 
        color: '#10b981'
      }
    };
    
    // REMOVED: Old getArchetypeLevel function - scoreResult.levels used exclusively

    // Transform scores into array for handlebars (prefer scoreResult v2 data)
    const scoreData = pathwayData.scoreResult || {};
    const scores = scoreData.displayPct || pathwayData.fuzzyScores || {};
    const levels = scoreData.levels || {};
    const absPct = scoreData.absPct || {};
    
    console.log('🔍 Creating fuzzyScoresArray with:', {
      scoreDataExists: !!scoreData,
      scoresKeys: Object.keys(scores),
      levelsObject: levels,
      absPctObject: absPct,
      validScoresWillBe: scores && Object.keys(scores).length > 0 ? scores : 'fallback'
    });
    
    
    // Ensure we have valid scores data - create fallback if needed
    const validScores = scores && Object.keys(scores).length > 0 ? scores : {
      'touring-performer': 33,
      'creative-artist': 33, 
      'writer-producer': 34
    };
    
    const fuzzyScoresArray = Object.entries(validScores)
      .sort((a, b) => b[1] - a[1])
      .map(([key, percentage], index) => {
        const info = pathwayInfo[key] || { 
          name: key, 
          icon: '🎵', 
          color: '#1DD1A1'
        };
        
        // Use scoreResult levels with robust fallback
        const levelName = levels[key] || (index === 0 ? 'Core Focus' : index === 1 ? 'Strategic Secondary' : 'Noise');
        const archetypeLevel = { 
          level: levelName, 
          icon: levelName === 'Core Focus' ? '🏆' : levelName === 'Strategic Secondary' ? '⚡' : '', 
          description: '' 
        };
        const isPrimary = scoreData.recommendation?.path === key || pathwayData.pathwayBlend?.primary === key;
        const isSecondary = index === 1 && !isPrimary;
        
        // Use AI-generated pathway details with robust fallbacks
        const aiPathwayDetails = pathwayData.pathwayDetails || {};
        const pathwayDetail = aiPathwayDetails[key] || {
          focusMessage: `Your ${info.name} alignment shows ${levelName.toLowerCase()} potential for this path.`,
          focusAreas: 'Core skills • Strategic development • Community building',
          growthAreas: 'Focus on strengths • Build strategic partnerships • Develop expertise'
        };
        
        // Calculate relative percentages that add up to 100%
        const totalAbsPct = Object.values(absPct).reduce((sum, pct) => sum + pct, 0);
        const relativePct = Math.round((absPct[key] / totalAbsPct) * 100) || percentage;
        
        return {
          key,
          percentage,
          relativePct,
          absolutePercentage: Math.round(absPct[key] || percentage),
          name: PATH_LABELS[key] || info.name,
          icon: info.icon,
          color: info.color,
          // Use AI-generated content with robust fallbacks
          focusMessage: pathwayDetail.focusMessage || `Your ${info.name} alignment shows ${levelName.toLowerCase()} potential for this path.`,
          focusAreas: pathwayDetail.focusAreas || 'Core skills • Strategic development • Community building',
          growthAreas: pathwayDetail.growthAreas || 'Focus on strengths • Build strategic partnerships • Develop expertise',
          archetypeLevel: archetypeLevel.level,
          archetypeIcon: archetypeLevel.icon,
          archetypeDescription: archetypeLevel.description,
          isPrimary,
          isSecondary,
          isFirst: index === 0
        };
      });
    
    // Ensure fuzzyScoresArray always has at least one valid entry
    if (fuzzyScoresArray.length === 0) {
      fuzzyScoresArray.push({
        key: 'creative-artist',
        percentage: 100,
        relativePct: 100,
        absolutePercentage: 100,
        name: 'Creative Artist',
        icon: '🎨',
        color: '#ec4899',
        focusMessage: 'This pathway aligns with your creative goals.',
        focusAreas: 'Creative development • Skill building • Community engagement',
        growthAreas: 'Focus on core strengths • Build strategic partnerships',
        archetypeLevel: 'Core Focus',
        archetypeIcon: '🏆',
        archetypeDescription: '',
        isPrimary: true,
        isSecondary: false,
        isFirst: true
      });
    }

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

    // Helper to get exactly 3 UNIQUE resources for a step
    Handlebars.registerHelper('getStepResources', function(allResources, stepIndex) {
      if (!allResources || allResources.length === 0) return [];
      
      const stepResources = [];
      const usedIndices = new Set();
      
      for (let i = 0; i < 3; i++) {
        let resourceIndex;
        let attempts = 0;
        
        // Find a unique resource index for this position
        do {
          resourceIndex = (stepIndex + i * 4 + attempts) % allResources.length;
          attempts++;
        } while (usedIndices.has(resourceIndex) && attempts < allResources.length);
        
        usedIndices.add(resourceIndex);
        stepResources.push(allResources[resourceIndex]);
      }
      
      return stepResources;
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

    // Add action items to pathway data for PDF display
    if (pathwayData.pathway && pathwayData.pathway.nextSteps) {
      pathwayData.pathway.nextSteps = pathwayData.pathway.nextSteps.map((step, index) => ({
        ...step,
        actions: generateActionsForStep(step.step, index, pathwayData.pathway)
      }));
    }

    // Generate description using same logic as app
    const rec = pathwayData.scoreResult?.recommendation;
    const topPath = rec?.path || fuzzyScoresArray[0]?.key;
    const topLabel = rec?.promoted ? 'Recommended Focus' : 'Core Focus';
    const topPathName = PATH_LABELS[topPath] || topPath;
    
    // Generate description using EXACT same logic as app
    const sortedPaths = fuzzyScoresArray;
    const primary = sortedPaths[0];
    const secondary = sortedPaths[1];
    const stage = pathwayData.responses?.['stage-level'] || 'planning';
    
    let dynamicDescription;
    if (primary?.archetypeLevel === 'Core Focus' && secondary?.archetypeLevel === 'Strategic Secondary' && primary?.key && secondary?.key) {
      dynamicDescription = `Your ${PATH_LABELS[primary.key]} strength should lead your strategy, with your ${PATH_LABELS[secondary.key]} skills as strategic support. This balance creates the fastest path to your vision.`;
    } else if (primary?.archetypeLevel === 'Core Focus' && primary?.key) {
      dynamicDescription = `Your ${PATH_LABELS[primary.key]} strength is your clear advantage. This is where you naturally excel and should invest most of your energy for ${stage} stage success.`;
    } else if (primary?.key) {
      dynamicDescription = `Your ${PATH_LABELS[primary.key]} path shows the strongest potential. Start here to build clarity and momentum in your music career.`;
    } else {
      dynamicDescription = `Your music creator path shows strong potential. Start here to build clarity and momentum in your music career.`;
    }
    
    const templateData = {
      ...pathwayData,
      fuzzyScoresArray,
      recommendation: pathwayData.scoreResult?.recommendation,
      topLabel,
      topPathName,
      stageLevel: pathwayData.scoreResult?.stageLevel,
      dynamicDescription,
      currentDate: new Date().toLocaleDateString()
    };

    console.log('📄 Template data prepared, compiling...');

    // Final validation before template rendering
    if (!fuzzyScoresArray || fuzzyScoresArray.length === 0) {
      console.error('❌ CRITICAL: fuzzyScoresArray is empty or undefined before template rendering');
      throw new Error('Invalid fuzzyScoresArray data for template rendering');
    }
    
    // Validate that all objects in fuzzyScoresArray have required properties
    const invalidObjects = fuzzyScoresArray.filter(item => !item.key || !item.name);
    if (invalidObjects.length > 0) {
      console.error('❌ CRITICAL: Found objects missing key or name properties:', invalidObjects);
      throw new Error('Invalid fuzzyScoresArray objects missing required properties');
    }
    
    console.log('✅ fuzzyScoresArray validation passed, rendering template...');

    // Read and compile template
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateContent);
    const renderedHtml = template(templateData);

    console.log('📝 Template rendered successfully');

    console.log('🖥️ Launching browser...');

    // Launch browser with emoji support
    const browser = await puppeteer.launch({
      headless: true,
      ...(isDev ? {
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--font-render-hinting=none',
          '--disable-font-subpixel-positioning',
          '--enable-font-antialiasing'
        ]
      } : {
        args: [
          ...chromium.args,
          '--font-render-hinting=none',
          '--disable-font-subpixel-positioning',
          '--enable-font-antialiasing'
        ],
        executablePath: await chromium.executablePath(),
      }),
    });

    const page = await browser.newPage();
    
    await page.setContent(renderedHtml, { 
      waitUntil: "networkidle0",
      timeout: 30000
    });
    
    // Inject selective emoji font support
    await page.evaluateOnNewDocument(() => {
      // Force emoji font loading only for specific emoji elements
      const style = document.createElement('style');
      style.textContent = `
        /* Default font for all elements - no emoji conversion */
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          font-variant-emoji: text !important;
          -webkit-font-variant-emoji: text !important;
        }
        
        /* Emoji fonts only for specific emoji elements */
        .archetype-icon, .product-icon, .detail-label, .why-icon, .action-icon, .sparkle, .sparkle-pink {
          font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji Mozilla', 'Android Emoji', 'EmojiOne Color' !important;
          font-variant-emoji: emoji !important;
          -webkit-font-variant-emoji: emoji !important;
        }
        
        /* Ensure numbers stay as regular text */
        .step-number, .action-number, .page-header-badge {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          font-variant-emoji: text !important;
          -webkit-font-variant-emoji: text !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Set media type to screen for proper background rendering
    await page.emulateMediaType('screen');

    // Wait for fonts to load, including emoji fonts
    await page.evaluate(() => {
      return Promise.all([
        document.fonts.ready,
        new Promise(resolve => {
          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(resolve);
          } else {
            setTimeout(resolve, 3000);
          }
        })
      ]);
    });

    // Additional wait for emoji rendering
    await new Promise(resolve => setTimeout(resolve, 3000));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      omitBackground: false,
      margin: {
        top: '3mm',
        bottom: '15mm', 
        left: '3mm',
        right: '3mm'
      }
    });

    await browser.close();

    console.log('✅ PDF generated successfully, buffer size:', pdfBuffer.length);

    // Send PDF with proper headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="music-creator-roadmap-${sessionId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
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