import { ImageResponse } from 'next/og';
import { LogoMark } from '@/components/logo';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0710',
        }}
      >
        {/* Same mark as components/logo.tsx and opengraph-image.tsx — not a stand-in. */}
        <LogoMark size={30} />
      </div>
    ),
    { ...size },
  );
}
