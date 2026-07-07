import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { BottomNav } from '../layout/BottomNav';

const AVATAR_URL = 'https://images.unsplash.com/photo-1617397303021-f68bae9f29d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc29mdCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzcwMzk2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080';
const ROSE_URL = 'https://images.unsplash.com/photo-1758983304729-1912eabc68f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwcm9zZSUyMGJ1ZCUyMGNsb3NldXAlMjBzb2Z0fGVufDF8fHx8MTc3NzAzOTY0NXww&ixlib=rb-4.1.0&q=80&w=1080';

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: 'Infinite Reflection',
    description: 'Unlimited entries for every moment of clarity or pause.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9a7878">
        <path d="M12 1L13.8 10.2L23 12L13.8 13.8L12 23L10.2 13.8L1 12L10.2 10.2Z" />
      </svg>
    ),
    title: 'Mindful Insights',
    description: 'Gentle AI themes that surface recurring emotions in your writing.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Private Sanctum',
    description: 'Biometric locks to keep your inner world completely your own.',
  },
];

export function PremiumUpgradeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col" style={{ height: '794px', background: '#f5ede9' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: 'rgba(245,237,233,0.97)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(180,130,130,0.12)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{ width: '36px', height: '36px', border: '2px solid rgba(160,110,110,0.3)' }}
          >
            <ImageWithFallback
              src={AVATAR_URL}
              alt="Nai"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
            Nai
          </span>
        </div>
        <button
          onClick={() => navigate('/profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Rose image */}
        <div className="flex justify-center pt-8 pb-6">
          <div
            className="rounded-full overflow-hidden"
            style={{
              width: '80px',
              height: '80px',
              boxShadow: '0 4px 20px rgba(160,100,100,0.25)',
            }}
          >
            <ImageWithFallback
              src={ROSE_URL}
              alt="Premium"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Headline */}
        <div className="px-8 text-center mb-8">
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '28px',
              color: '#2d1818',
              fontWeight: '700',
              lineHeight: 1.25,
              marginBottom: '12px',
            }}
          >
            Grow with yourself,<br />deeply
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#8a6a6a',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6,
            }}
          >
            A sanctuary for your thoughts, designed to help you rediscover the quiet spaces within.
          </p>
        </div>

        {/* Features */}
        <div className="px-5 flex flex-col gap-3 mb-8">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="flex items-start gap-4 rounded-2xl px-4 py-4"
              style={{
                background: 'rgba(255,255,255,0.75)',
                boxShadow: '0 1px 8px rgba(100,60,60,0.07)',
              }}
            >
              <div
                className="rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ width: '40px', height: '40px', background: '#f0e5e3' }}
              >
                {feat.icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#2d1818',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '3px',
                  }}
                >
                  {feat.title}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#8a6a6a',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="px-5 mb-5">
          <div className="text-center mb-5">
            <span
              className="px-4 py-1 rounded-full"
              style={{
                background: '#e8d5d2',
                fontSize: '11px',
                color: '#7a5050',
                fontWeight: '600',
                letterSpacing: '1px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ANNUAL ACCESS
            </span>
            <div className="mt-4 mb-1">
              <span
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#2d1818',
                }}
              >
                $4.99
              </span>
              <span
                style={{
                  fontSize: '16px',
                  color: '#9a7878',
                  fontFamily: 'Inter, sans-serif',
                  marginLeft: '2px',
                }}
              >
                / month
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#b09090', fontFamily: 'Inter, sans-serif' }}>
              Billed annually at $59.88
            </p>
          </div>

          {/* CTA buttons */}
          <button
            className="w-full py-4 rounded-2xl mb-3 transition-opacity active:opacity-80"
            style={{
              background: 'linear-gradient(135deg, #5a3535, #3d2020)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 6px 20px rgba(60,30,30,0.3)',
              letterSpacing: '0.2px',
            }}
          >
            Start 7-day free trial
          </button>

          <button
            className="w-full py-4 rounded-2xl mb-6 transition-opacity active:opacity-80"
            style={{
              background: 'white',
              color: '#5a3535',
              border: '1.5px solid rgba(160,110,110,0.3)',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            View monthly plan
          </button>

          {/* Quote */}
          <p
            style={{
              fontSize: '12px',
              color: '#9a7878',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            "Investing in your own growth is the most meaningful journey you'll ever take."
          </p>

          {/* Footer links */}
          <div className="flex justify-center gap-4 mb-2">
            {['Privacy Policy', 'Terms of Use'].map((link) => (
              <button
                key={link}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b09090',
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {link}
              </button>
            ))}
          </div>
          <p
            style={{
              fontSize: '10px',
              color: '#c0a0a0',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              lineHeight: 1.5,
              paddingBottom: '8px',
            }}
          >
            Cancel anytime in your App Store settings. Your subscription will auto-renew unless turned off at least 24 hours before the period ends.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
