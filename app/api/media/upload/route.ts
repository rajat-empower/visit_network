import { NextResponse } from 'next/server';

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_REGION = process.env.BUNNY_REGION || 'sg';

export async function POST(request: Request) {
  try {
    const { url, folder } = await request.json();

    if (!url) {
      return NextResponse.json(
        { status: 'error', message: 'URL is required' },
        { status: 400 }
      );
    }

    // Download image from URL
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // Upload to BunnyCDN
    const bunnyResponse = await fetch(
      `https://${BUNNY_REGION}.storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'AccessKey': BUNNY_API_KEY as string,
          'Content-Type': 'image/jpeg'
        },
        body: imageBuffer
      }
    );

    if (!bunnyResponse.ok) {
      throw new Error('Failed to upload to BunnyCDN');
    }

    // Return the CDN URL
    return NextResponse.json({
      status: 'success',
      url: `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${fileName}`
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to upload media'
      },
      { status: 500 }
    );
  }
} 