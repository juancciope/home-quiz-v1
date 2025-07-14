import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pathwayData } = req.body;

    if (!pathwayData) {
      return res.status(400).json({
        success: false,
        message: "PathwayData is required."
      });
    }

    // Get template path
    const templatePath = path.join(process.cwd(), "public/pdf-templates/roadmap.template.hbs");

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({
        success: false,
        message: "Template not found at: " + templatePath
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
        return {
          key,
          percentage,
          name: info.name,
          icon: info.icon,
          color: info.color
        };
      });

    // Register handlebars helpers
    Handlebars.registerHelper('index1', function(options) {
      return parseInt(options.data.index) + 1;
    });

    // Prepare template data
    const templateData = {
      ...pathwayData,
      fuzzyScoresArray,
      currentDate: new Date().toLocaleDateString()
    };

    // Read and compile template
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateContent);
    const renderedHtml = template(templateData);

    // Return HTML for inspection
    res.setHeader('Content-Type', 'text/html');
    res.send(renderedHtml);

  } catch (error) {
    console.error("❌ Error generating HTML:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}