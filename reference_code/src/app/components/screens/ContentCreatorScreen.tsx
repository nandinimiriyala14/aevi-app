import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../layout/BottomNav';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const AVATAR_URL = 'https://images.unsplash.com/photo-1617397303021-f68bae9f29d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc29mdCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzcwMzk2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080';

const moods = ['Poetic', 'Minimalist', 'Philosophical'];

export function ContentCreatorScreen() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('Poetic');
  const [refining, setRefining] = useState(false);
  const [refined, setRefined] = useState(false);

  const handleRefine = () => {
    setRefining(true);
    setTimeout(() => {
      setRefining(false);
      setRefined(true);
    }, 1500);
  };

  const captions: Record<string, string> = {
    Poetic: 'The luxury of stillness found in a single beam of light and a warm cup of coffee.',
    Minimalist: 'Steam. Light. Pause. That\'s enough.',
    Philosophical: 'In the space between intention and action lives the most honest version of yourself.',
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: '794px', background: '#f0dbd9' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: 'rgba(240,219,217,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(180,130,130,0.15)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/journal')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '2px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
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
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>Nai</span>
        </div>
        <button
          onClick={() => navigate('/profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'none' }}>
        {/* Label */}
        <p style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginBottom: '10px' }}>
          YOUR MORNING REFLECTION
        </p>

        {/* Journal entry card */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(100,60,60,0.08)' }}
        >
          <p style={{ fontSize: '14px', color: '#2d1818', lineHeight: 1.7, fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
            "Watched the sun hit the coffee steam today. Felt like the world was asking me to just sit still for once. No rush, no noise. Just the warmth of the mug."
          </p>
        </div>

        {/* Aevi's Refinement */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: 'white',
            boxShadow: '0 1px 8px rgba(100,60,60,0.08)',
            border: '1px solid rgba(180,130,130,0.15)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#9a7878">
              <path d="M12 1L13.8 10.2L23 12L13.8 13.8L12 23L10.2 13.8L1 12L10.2 10.2Z"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif' }}>Aevi's Refinement</span>
          </div>

          {/* Instagram Caption */}
          <div
            className="rounded-xl p-4 mb-3"
            style={{ background: '#faf5f4', border: '1px solid rgba(180,130,130,0.12)' }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b09090" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="#b09090"/>
              </svg>
              <span style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.2px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                INSTAGRAM CAPTION
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '20px',
                color: '#2d1818',
                lineHeight: 1.4,
                marginBottom: '12px',
              }}
            >
              {captions[selectedMood]}
            </p>
            <div className="flex gap-2 flex-wrap">
              {['#SlowLiving', '#MorningRitual', '#StillnessIsPower'].slice(0, selectedMood === 'Minimalist' ? 2 : 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '12px',
                    color: '#9a7878',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Structured Note */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#faf5f4', border: '1px solid rgba(180,130,130,0.12)' }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b09090" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              <span style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.2px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                STRUCTURED NOTE
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {[
                'Observation: Light interacting with steam.',
                'Internal State: Unexpected permission to pause.',
                'Sensory Anchor: Tactile warmth of ceramic.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: '#9a7878', fontSize: '14px', marginTop: '0px' }}>•</span>
                  <span style={{ fontSize: '13px', color: '#4d3030', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refine button */}
        <button
          onClick={handleRefine}
          disabled={refining}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-3 transition-opacity active:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #5a3535, #3d2020)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 16px rgba(60,30,30,0.3)',
            opacity: refining ? 0.7 : 1,
          }}
        >
          {refining ? (
            <>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Refining...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              {refined ? 'Refine Again with Aevi' : 'Refine with Aevi'}
            </>
          )}
        </button>

        {/* Share button */}
        <button
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-4 transition-opacity active:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.8)',
            color: '#5a3535',
            border: '1.5px solid rgba(160,110,110,0.3)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a3535" strokeWidth="2" strokeLinecap="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Share to World
        </button>

        {/* Mood selector */}
        <div className="mb-4">
          <p style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.2px', fontFamily: 'Inter, sans-serif', fontWeight: '600', textAlign: 'center', marginBottom: '10px' }}>
            WANT A DIFFERENT MOOD?
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className="px-4 py-2 rounded-full transition-all"
                style={{
                  background: selectedMood === mood ? 'linear-gradient(135deg, #8a6060, #6a4040)' : 'rgba(255,255,255,0.8)',
                  color: selectedMood === mood ? 'white' : '#5a3535',
                  border: selectedMood === mood ? 'none' : '1px solid rgba(160,110,110,0.25)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}