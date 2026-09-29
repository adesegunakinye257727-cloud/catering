import { v2 as cloudinary } from 'cloudinary';

// Replaces the /api/cloudinary/* routes from server.ts, which only run under Express.
function configure() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'tomxzhw2';
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudName;
}

export default async (req: Request) => {
  const cloudName = configure();
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/cloudinary\/?/, '');

  try {
    if (route === 'status' && req.method === 'GET') {
      const ping = await cloudinary.api.ping();
      return Response.json({ status: 'connected', cloudName, ping });
    }

    if (route === 'config' && req.method === 'GET') {
      return Response.json({ cloudName, apiKey: process.env.CLOUDINARY_API_KEY });
    }

    if (route === 'upload' && req.method === 'POST') {
      const { file, folder = 'cinematic_assets', tags } = await req.json();
      if (!file) {
        return Response.json({ error: 'Missing file parameter' }, { status: 400 });
      }
      const uploadOptions: Record<string, any> = { folder, resource_type: 'auto' };
      if (tags && Array.isArray(tags)) uploadOptions.tags = tags;

      const result = await cloudinary.uploader.upload(file, uploadOptions);
      return Response.json({
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
    }

    if (route === 'sign' && req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const folder = body?.folder || 'cinematic_assets';
      const timestamp = Math.round(Date.now() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET as string
      );
      return Response.json({
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName,
        folder,
      });
    }

    if (route === 'resources' && req.method === 'GET') {
      const maxResults = Math.min(Number(url.searchParams.get('max')) || 20, 100);
      const results = await cloudinary.api.resources({
        type: 'upload',
        max_results: maxResults,
        resource_type: 'image',
      });
      return Response.json({
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
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Cloudinary error:', error);
    return Response.json({ error: error?.message || 'Cloudinary request failed' }, { status: 500 });
  }
};

export const config = {
  path: '/api/cloudinary/*',
};
