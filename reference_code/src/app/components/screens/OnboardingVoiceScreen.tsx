import { useState } from 'react';
import { useNavigate } from 'react-router';

const toneOptions = [
  { id: 'warm', label: 'Warm & gentle' },
  { id: 'direct', label: 'Direct & honest' },
  { id: 'curious', label: 'Curious & deep' },
  { id: 'calm', label: 'Calm & grounding' },
];

const topicOptions = [
  'Work & career',
  'Relationships',
  'Creativity',
  'Health',
  'Purpose',
  'Decisions',
  'Emotions',
  'Ideas',
  'Growth',
  'Writing',
];

export function OnboardingVoiceScreen() {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState('warm');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Work & career', 'Creativity', 'Purpose']);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div
      className="flex flex-col min-h-[794px] px-5"
      style={{ background: '#f0dbd9' }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/onboarding')}
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
          Shape<br />my voice
        </h1>
        <p style={{ fontSize: '14px', color: '#9a7878', fontFamily: 'Inter, sans-serif' }}>
          How should I sound when I talk to you?
        </p>
      </div>

      {/* Tone grid */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {toneOptions.map((tone) => {
          const isSelected = selectedTone === tone.id;
          return (
            <button
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              className="py-4 px-4 rounded-2xl text-center transition-all"
              style={{
                background: isSelected ? 'linear-gradient(135deg, #8a6060, #6a4040)' : 'white',
                color: isSelected ? 'white' : '#2d1818',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                boxShadow: isSelected ? '0 4px 14px rgba(100,60,60,0.3)' : '0 1px 4px rgba(100,60,60,0.06)',
              }}
            >
              {tone.label}
            </button>
          );
        })}
      </div>

      {/* Topics */}
      <div className="mt-6">
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>
          Topics you'd like to explore
        </p>
        <div className="flex flex-wrap gap-2">
          {topicOptions.map((topic) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className="px-4 py-2 rounded-full transition-all"
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #8a6060, #6a4040)' : 'white',
                  color: isSelected ? 'white' : '#4d3030',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isSelected ? '500' : '400',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: isSelected ? '0 3px 10px rgba(100,60,60,0.25)' : '0 1px 4px rgba(100,60,60,0.06)',
                }}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex items-center justify-between pb-8 mt-6">
        <div className="flex gap-2 items-center">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(180,130,130,0.4)' }} />
          <div style={{ width: '28px', height: '6px', borderRadius: '3px', background: '#7a5555' }} />
        </div>
        <button
          onClick={() => navigate('/chat')}
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
          Meet Aevi
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
