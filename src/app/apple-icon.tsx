import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Green 3D Box */}
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
          {/* Dark Blue Document */}
          <path d="M22 36 L22 12 L36 12 L42 18 L42 36 Z" fill="#1e3a5f" />
          <path d="M36 12 L36 18 L42 18" fill="#152a45" />
          {/* Arrow pointing up */}
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
    ),
    {
      ...size,
    }
  );
}
