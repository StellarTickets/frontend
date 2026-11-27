import { ImageResponse } from 'next/og';
import { LogoMarkImage } from '@/components/logo';

// Google requires Organization.logo to be at least 112×112 px.
// /icon is a 32×32 favicon and is rejected. This route serves the same mark
// at 512×512 on the brand background and is referenced by buildStructuredData.
export const contentType = 'image/png';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <LogoMarkImage size={400} />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
