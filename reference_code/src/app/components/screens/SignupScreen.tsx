import { useState } from 'react';
import { useNavigate } from 'react-router';

export function SignupScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputStyle: React.CSSProperties = {
    background: '#faf5f4',
    border: '1.5px solid rgba(180,130,130,0.2)',
    fontSize: '15px',
    color: '#2d1818',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '14px',
    padding: '14px 16px',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '600',
    color: '#9a7070',
    letterSpacing: '1.5px',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <div
      className="flex flex-col min-h-[794px]"
      style={{ background: 'linear-gradient(180deg, #e2c8c5 0%, #ebd4d1 20%, #f0dbd9 50%)' }}
    >
      {/* Header */}
      <div className="px-7 pt-8 pb-6">
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '38px',
            color: '#2d1818',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '6px',
          }}
        >
          Create your<br />private space
        </h1>
        <p style={{ fontSize: '14px', color: '#9a7070', fontFamily: 'Inter, sans-serif' }}>
          Your thoughts stay here. Always.
        </p>
      </div>

      {/* Form card */}
      <div
        className="mx-4 rounded-3xl px-5 py-6 flex flex-col gap-4"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 20px rgba(120,70,70,0.08)',
          flex: 1,
        }}
      >
        {/* Name */}
        <div>
          <label style={labelStyle}>YOUR NAME</label>
          <input
            type="text"
            placeholder="Nai"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Create Account */}
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full py-4 rounded-2xl mt-2 transition-opacity active:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #8a6060, #6a4040)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 16px rgba(100,60,60,0.3)',
          }}
        >
          Create Account
        </button>

        {/* Sign in link */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#9a7070', fontFamily: 'Inter, sans-serif' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              color: '#7a5555',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Sign in
          </button>
        </p>

        {/* Social buttons */}
        <div className="flex flex-col gap-3 mt-1">
          <button
            className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-opacity active:opacity-80"
            style={{
              background: '#fdf0ee',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#2d1818',
              fontWeight: '500',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button
            className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-opacity active:opacity-80"
            style={{
              background: '#fdf0ee',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#2d1818',
              fontWeight: '500',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1d1d1f">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Privacy note */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#b09090', fontFamily: 'Inter, sans-serif', marginTop: 'auto' }}>
          By continuing you agree to our{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>
      <div className="pb-6" />
    </div>
  );
}
