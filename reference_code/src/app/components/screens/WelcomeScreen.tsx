import { useNavigate } from 'react-router';
import { AeviLogo } from '../AeviLogo';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center min-h-[794px] px-8"
      style={{
        background: 'linear-gradient(180deg, #e2c8c5 0%, #ebd4d1 30%, #f0dbd9 60%, #f0dbd9 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mt-12 mb-2">
        <AeviLogo size="lg" showText={true} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div style={{ width: '55px', height: '1px', background: 'rgba(160,110,110,0.4)' }} />
        <svg width="8" height="8" viewBox="0 0 8 8" fill="rgba(170,120,120,0.6)">
          <polygon points="4,0 8,4 4,8 0,4" />
        </svg>
        <div style={{ width: '55px', height: '1px', background: 'rgba(160,110,110,0.4)' }} />
      </div>

      {/* Tagline */}
      <div className="flex flex-col items-center text-center px-4">
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '30px',
            color: '#2d1818',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '14px',
          }}
        >
          Meet your alter ego.
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#8a6868',
            lineHeight: 1.7,
            maxWidth: '260px',
          }}
        >
          A companion that remembers,<br />reflects, and evolves with you.
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3 pb-10">
        <button
          onClick={() => navigate('/signup')}
          className="w-full py-4 rounded-2xl transition-opacity active:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #8a6060, #6a4040)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.3px',
            boxShadow: '0 4px 16px rgba(100,60,60,0.3)',
          }}
        >
          Let's Begin
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl transition-opacity active:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.6)',
            color: '#4d2f2f',
            fontSize: '16px',
            fontWeight: '500',
            border: '1.5px solid rgba(160,110,110,0.4)',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Sign In
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#b89898',
            letterSpacing: '2px',
            marginTop: '12px',
            fontWeight: '500',
          }}
        >
          PRIVATE · REMEMBERED · YOURS
        </p>
      </div>
    </div>
  );
}
