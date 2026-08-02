import { ImageResponse } from 'next/og';
import { LogoMark } from '@/components/logo';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: '#0b0a10',
          backgroundImage:
            'radial-gradient(60% 50% at 30% 0%, rgba(139,92,246,0.22), transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Same mark as components/logo.tsx and app/icon.tsx — not a stand-in. */}
            <LogoMark size={28} color="#a78bfa" />
          </div>
          <div style={{ display: 'flex', color: '#fff', fontSize: 40, fontWeight: 700 }}>
            StellarTickets
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: '#fff',
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Secure. Verifiable. Powered by Stellar.
        </div>
        <div
          style={{
            display: 'flex',
            color: '#9c98ad',
            fontSize: 28,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          Blockchain-powered tickets for concerts, flights, sports, and more.
        </div>
      </div>
    ),
    { ...size },
  );
}
