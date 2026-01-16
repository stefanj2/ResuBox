import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ResuBox - Professionele CV Builder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 50%, #f0fdf4 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 20 L32 8 L56 20 L56 44 L32 56 L8 44 Z"
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M8 20 L32 32 L32 56"
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M32 32 L56 20"
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M22 36 L22 12 L36 12 L42 18 L42 36 Z" fill="#1e3a5f" />
            <path d="M36 12 L36 18 L42 18" fill="#152a45" />
            <path
              d="M32 32 L32 20 M26 26 L32 20 L38 26"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          ResuBox
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#475569',
            marginBottom: 40,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Maak een professioneel CV in minuten
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 32,
          }}
        >
          {['6 Templates', 'ATS-Geoptimaliseerd', 'Direct PDF'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'white',
                padding: '12px 24px',
                borderRadius: 50,
                border: '2px solid #e2e8f0',
                fontSize: 20,
                color: '#334155',
                fontWeight: 500,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#16a34a">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            fontSize: 24,
            color: '#16a34a',
            fontWeight: 600,
          }}
        >
          resubox.nl
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
