const fs = require('fs');
const path = require('path');

// Create directory structure
const dirPath = path.join(__dirname, 'app', 'l', '[shortcode]');
fs.mkdirSync(dirPath, { recursive: true });

// Create route.ts file
const routeContent = `import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/data/links';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  // Look up the link by short code
  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    return NextResponse.json(
      { error: 'Short link not found' },
      { status: 404 }
    );
  }

  // Redirect to the original URL
  return NextResponse.redirect(link.originalUrl, 301);
}`;

const filePath = path.join(dirPath, 'route.ts');
fs.writeFileSync(filePath, routeContent);

console.log('Directory created:', dirPath);
console.log('File created:', filePath);
