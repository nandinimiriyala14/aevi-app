import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../layout/BottomNav';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const AVATAR_URL = 'https://images.unsplash.com/photo-1617397303021-f68bae9f29d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc29mdCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzcwMzk2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080';

const tones = [
  { label: 'Gentle', icon: '🏠' },
  { label: 'Direct', icon: '◎' },
  { label: 'Motivating', icon: '✦' },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '44px',
        height: '26px',
        borderRadius: '13px',
        background: on ? '#5a3535' : '#d4bfbe',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: on ? '21px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }}
      />
    </button>
  );
}

export function ProfileScreen() {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState('Gentle');
  const [contextPersistence, setContextPersistence] = useState(true);
  const [weeklyRecaps, setWeeklyRecaps] = useState(false);

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
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5" style={{ scrollbarWidth: 'none' }}>
        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="rounded-full overflow-hidden mb-2"
            style={{
              width: '76px',
              height: '76px',
              border: '3px solid rgba(160,110,110,0.3)',
              boxShadow: '0 4px 16px rgba(120,70,70,0.2)',
            }}
          >
            <ImageWithFallback
              src={AVATAR_URL}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Premium badge */}
          <div
            className="px-3 py-0.5 rounded-full mb-2"
            style={{ background: 'linear-gradient(135deg, #8a6060, #5a3535)' }}
          >
            <span style={{ fontSize: '10px', color: 'white', fontWeight: '600', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif' }}>
              PREMIUM
            </span>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
            Evelyn Harper
          </h2>
          <p style={{ fontSize: '12px', color: '#9a7878', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
            Embracing the quiet since March 2023
          </p>
        </div>

        {/* Tone Settings */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(100,60,60,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#9a7878">
              <path d="M12 1L13.8 10.2L23 12L13.8 13.8L12 23L10.2 13.8L1 12L10.2 10.2Z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
              Tone Settings
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#9a7878', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>
            Choose how Aevi reflects your thoughts back to you.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {tones.map((tone) => {
              const active = selectedTone === tone.label;
              return (
                <button
                  key={tone.label}
                  onClick={() => setSelectedTone(tone.label)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all"
                  style={{
                    background: active ? 'linear-gradient(135deg, #5a3535, #3d2020)' : '#f5eeec',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{tone.icon}</span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: active ? 'white' : '#5a3535',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {tone.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Control */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(100,60,60,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="2" strokeLinecap="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
              Memory Control
            </span>
          </div>

          <div
            className="flex items-center justify-between py-3"
            style={{ borderBottom: '1px solid rgba(180,130,130,0.1)' }}
          >
            <div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
                Context Persistence
              </p>
              <p style={{ fontSize: '11px', color: '#9a7878', fontFamily: 'Inter, sans-serif' }}>
                Remember past sessions
              </p>
            </div>
            <Toggle on={contextPersistence} onToggle={() => setContextPersistence(!contextPersistence)} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
                Weekly Recaps
              </p>
              <p style={{ fontSize: '11px', color: '#9a7878', fontFamily: 'Inter, sans-serif' }}>
                Synthesize your growth
              </p>
            </div>
            <Toggle on={weeklyRecaps} onToggle={() => setWeeklyRecaps(!weeklyRecaps)} />
          </div>
        </div>

        {/* Quiet Hours */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(100,60,60,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
              Quiet Hours
            </span>
          </div>
          <div
            className="rounded-xl flex flex-col items-center py-4"
            style={{ background: '#f5eeec' }}
          >
            <p style={{ fontSize: '22px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}>
              22:00 — 07:00
            </p>
            <p style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginTop: '4px' }}>
              NOTIFICATION SILENCE
            </p>
          </div>
        </div>

        {/* Premium promo */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, #f0e5e3, #e8d8d5)',
            boxShadow: '0 1px 8px rgba(100,60,60,0.07)',
          }}
        >
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#4d3030', fontFamily: 'Inter, sans-serif', marginBottom: '6px' }}>
            Deepening the Practice
          </p>
          <p style={{ fontSize: '12px', color: '#7a5a5a', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: '14px' }}>
            Unlock long-form audio journaling, emotional pattern mapping, and artisanal voice skins.
          </p>
          <button
            onClick={() => navigate('/premium')}
            className="w-full py-3.5 rounded-xl transition-opacity active:opacity-80"
            style={{
              background: 'linear-gradient(135deg, #5a3535, #3d2020)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.8px',
            }}
          >
            EXPLORE PREMIUM FEATURES
          </button>
        </div>

        {/* Privacy & Philosophy */}
        {[
          {
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
            label: 'Privacy & Data Security',
          },
          {
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            ),
            label: 'The Philosophy of Aevi',
          },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between px-4 py-4 rounded-2xl mb-3 transition-opacity active:opacity-70"
            style={{
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 8px rgba(100,60,60,0.07)',
            }}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span style={{ fontSize: '14px', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>
                {item.label}
              </span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b09090" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}

        {/* Sign out */}
        <div className="flex justify-center py-2 mb-4">
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#c87878',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
            }}
          >
            Log Out of Your Space
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
