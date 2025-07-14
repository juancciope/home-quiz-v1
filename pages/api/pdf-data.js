// Simple in-memory storage for PDF data (for demonstration)
// In production, you'd want to use a database or Redis
const pdfDataStore = new Map();

export default function handler(req, res) {
  const { sessionId } = req.query;

  if (req.method === 'POST') {
    // Store PDF data
    const { pathwayData } = req.body;
    pdfDataStore.set(sessionId, pathwayData);
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    // Retrieve PDF data
    const data = pdfDataStore.get(sessionId);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}