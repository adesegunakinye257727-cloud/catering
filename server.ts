import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'tomxzhw2',
  api_key: process.env.CLOUDINARY_API_KEY || '367332981779656',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FyzGoHxIZ5mDYFe6SLtjxg-ytWY',
  secure: true,
});

// Middleware for parsing JSON & large uploads (e.g. base64 image data)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cloudinary API Status
app.get('/api/cloudinary/status', async (_req, res) => {
  try {
    const pingResult = await cloudinary.api.ping();
    res.json({
      status: 'connected',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'tomxzhw2',
      ping: pingResult,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to connect to Cloudinary',
    });
  }
});

// Get public client-side Cloudinary config (safe: no secret exposed)
app.get('/api/cloudinary/config', (_req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'tomxzhw2',
    apiKey: process.env.CLOUDINARY_API_KEY || '367332981779656',
  });
});

// Secure server-side upload endpoint
app.post('/api/cloudinary/upload', async (req, res) => {
  try {
    const { file, folder = 'cinematic_assets', tags } = req.body;
    if (!file) {
      return res.status(400).json({ error: 'Missing file parameter' });
    }

    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: 'auto',
    };

    if (tags && Array.isArray(tags)) {
      uploadOptions.tags = tags;
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resourceType: result.resource_type,
      createdAt: result.created_at,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({
      error: error?.message || 'Cloudinary upload failed',
    });
  }
});

// Generate signature for direct signed client uploads
app.post('/api/cloudinary/sign', (req, res) => {
  try {
    const folder = req.body?.folder || 'cinematic_assets';
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'FyzGoHxIZ5mDYFe6SLtjxg-ytWY';
    const apiKey = process.env.CLOUDINARY_API_KEY || '367332981779656';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'tomxzhw2';

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret
    );

    res.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to sign request' });
  }
});

// List recent uploads from Cloudinary
app.get('/api/cloudinary/resources', async (req, res) => {
  try {
    const maxResults = Math.min(Number(req.query.max) || 20, 100);
    const results = await cloudinary.api.resources({
      type: 'upload',
      max_results: maxResults,
      resource_type: 'image',
    });

    res.json({
      resources: results.resources.map((r: any) => ({
        publicId: r.public_id,
        format: r.format,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        createdAt: r.created_at,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to list resources' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
