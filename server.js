const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3001;
const XML_FILE = path.join(__dirname, 'pacifica_affiliates.xml');

// Configure CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.text({ type: ['application/xml', 'text/xml'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Helper function to read the XML file
async function readXmlFile() {
    try {
        return await fs.readFile(XML_FILE, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create it with default content
            console.log('XML file not found, creating a new one...');
            const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>Pacifica Network Affiliates</title>
    <link>https://pacificanetwork.org/stations-2/</link>
    <atom:link href="https://starkey.digital/pacifica/pacifica_affiliates.xml" rel="self" type="application/rss+xml"/>
    <description>List of Pacifica Network affiliate stations</description>
    <language>en-us</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;
            await fs.writeFile(XML_FILE, defaultXml, 'utf-8');
            return defaultXml;
        }
        console.error('Error reading XML file:', error);
        throw new Error('Failed to read XML file: ' + error.message);
    }
}

// Helper function to write to the XML file
async function writeXmlFile(content) {
    try {
        await fs.writeFile(XML_FILE, content, 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing to XML file:', error);
        throw new Error('Failed to write to XML file');
    }
}

// Get the current XML
app.get('/api/xml', async (req, res) => {
    try {
        const xmlContent = await readXmlFile();
        res.set('Content-Type', 'application/xml');
        res.send(xmlContent);
    } catch (error) {
        console.error('Error in GET /api/xml:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update the XML
app.post('/api/xml', async (req, res) => {
    try {
        let xmlContent = req.body;
        console.log('Received XML content:', xmlContent ? 'Content received' : 'No content');
        
        if (!xmlContent) {
            console.error('No XML content provided');
            return res.status(400).json({ 
                success: false,
                error: 'No XML content provided' 
            });
        }
        
        // Validate XML content
        try {
            const parser = new XMLParser();
            const jsonObj = parser.parse(xmlContent);
            
            if (!jsonObj || !jsonObj.rss) {
                throw new Error('Invalid XML structure: Missing root rss element');
            }
            
            console.log('Successfully parsed XML content');
            
        } catch (parseError) {
            console.error('XML validation error:', parseError);
            return res.status(400).json({
                success: false,
                error: 'Invalid XML content',
                details: parseError.message
            });
        }
        
        // Write the XML to file
        await writeXmlFile(xmlContent);
        
        console.log('Successfully updated XML file');
        
        res.status(200).json({ 
            success: true,
            message: 'XML updated successfully' 
        });
        
    } catch (error) {
        console.error('Error in POST /api/xml:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to save XML',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
