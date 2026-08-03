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
          background: '#0a0710',
          backgroundImage:
            'radial-gradient(55% 60% at 10% 0%, rgba(167,139,250,0.28), transparent), radial-gradient(45% 45% at 100% 100%, rgba(244,114,182,0.2), transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              width: 60,
              height: 60,
              borderRadius: 14,
              background: 'rgba(167,139,250,0.14)',
              border: '1px solid rgba(167,139,250,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Same mark as components/logo.tsx and app/icon.tsx — not a stand-in. */}
            <LogoMark size={30} gradient={false} />
          </div>
          <div style={{ display: 'flex', color: '#fff', fontSize: 40, fontWeight: 700 }}>
            StellarTickets
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: '#fff',
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.12,
            maxWidth: 980,
          }}
        >
          Secure. Verifiable. Powered by Stellar.
        </div>
        <div
          style={{
            display: 'flex',
            color: '#a79fbe',
            fontSize: 28,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          Blockchain-powered tickets for concerts, flights, sports, and 9 more industries.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 44 }}>
          {['#a78bfa', '#f472b6', '#f5b400'].map((c) => (
            <div key={c} style={{ display: 'flex', width: 64, height: 6, borderRadius: 3, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
