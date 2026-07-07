import { useState } from 'react';
import { useNavigate } from 'react-router';

const goals = [
  {
    id: 'reflection',
    title: 'Self-reflection',
    desc: 'Process thoughts and understand myself',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'decisions',
    title: 'Better decisions',
    desc: 'Think through choices with clarity',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3"/>
        <circle cx="12" cy="12" r="0.8" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'creative',
    title: 'Creative writing',
    desc: 'Turn raw ideas into polished content',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'journaling',
    title: 'Daily journaling',
    desc: 'Build a consistent reflection habit',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 7H12M8 10H14M8 13H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 6H18C19.1 6 20 6.9 20 8V19C20 20.1 19.1 21 18 21H8C6.9 21 6 20.1 6 19V18" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

export function OnboardingGoalScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('reflection');

  return (
    <div
      className="flex flex-col min-h-[794px] px-5"
      style={{ background: '#f0dbd9' }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/signup')}
        className="mt-4 self-start flex items-center justify-center rounded-full transition-opacity active:opacity-70"
        style={{
          width: '36px',
          height: '36px',
          background: 'rgba(255,255,255,0.7)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a3535" strokeWidth="2.2" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>

      {/* Header card */}
      <div
        className="rounded-3xl px-5 py-5 mt-4"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
      >
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '34px',
            color: '#2d1818',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '6px',
          }}
        >
          What brings<br />you here?
        </h1>
        <p style={{ fontSize: '14px', color: '#9a7878', fontFamily: 'Inter, sans-serif' }}>
          I'll shape how I think around your goal.
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mt-5">
        {goals.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => setSelected(goal.id)}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all"
              style={{
                background: 'white',
                border: `2px solid ${isSelected ? '#7a5555' : 'transparent'}`,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 12px rgba(120,70,70,0.15)' : '0 1px 4px rgba(100,60,60,0.06)',
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: '46px',
                  height: '46px',
                  background: isSelected ? '#7a5555' : '#f5eeec',
                  color: isSelected ? 'white' : '#9a7878',
                }}
              >
                {goal.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
                  {goal.title}
                </p>
                <p style={{ fontSize: '13px', color: '#9a7878', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
                  {goal.desc}
                </p>
              </div>

              {/* Radio */}
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: '22px',
                  height: '22px',
                  border: `2px solid ${isSelected ? '#7a5555' : '#d4b0b0'}`,
                  background: 'transparent',
                }}
              >
                {isSelected && (
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7a5555' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex items-center justify-between pb-8 mt-6">
        <div className="flex gap-2 items-center">
          <div style={{ width: '28px', height: '6px', borderRadius: '3px', background: '#7a5555' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(180,130,130,0.4)' }} />
        </div>
        <button
          onClick={() => navigate('/onboarding/voice')}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-opacity active:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #8a6060, #6a4040)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 14px rgba(100,60,60,0.3)',
          }}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
