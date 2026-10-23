import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

// Branded link-preview card shown when the site is shared on FB, LinkedIn, X, etc.
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #141414 55%, #1e1e1e 100%)',
          padding: '72px',
          position: 'relative',
        }}
      >
        {/* Netflix-red glow */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'rgba(229, 9, 20, 0.28)',
            filter: 'blur(120px)',
          }}
        />

        {/* Top: name + verified-style accent bar */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: '#e50914',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: 44, height: 6, background: '#e50914', borderRadius: 3 }} />
            Portfolio
          </div>
          <div
            style={{
              marginTop: 24,
              color: '#ffffff',
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              marginTop: 20,
              color: '#b3b3b3',
              fontSize: 40,
              fontWeight: 600,
            }}
          >
            Web Developer &amp; Video Editor
          </div>
        </div>

        {/* Bottom: stack line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            color: '#8a8a8a',
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          Next.js · React · TypeScript · Video Editing · Cebu, PH
        </div>
      </div>
    ),
    { ...size },
  );
}
