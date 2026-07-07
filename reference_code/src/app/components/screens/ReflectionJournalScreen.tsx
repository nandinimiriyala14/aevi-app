import { useNavigate } from 'react-router';
import { BottomNav } from '../layout/BottomNav';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const AVATAR_URL = 'https://images.unsplash.com/photo-1617397303021-f68bae9f29d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc29mdCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzcwMzk2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080';
const LEAVES_URL = 'https://images.unsplash.com/photo-1762882940601-e17376f763ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBsZWF2ZXMlMjBnb2xkZW4lMjBsaWdodCUyMG5hdHVyZXxlbnwxfHx8fDE3NzcwMzk2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080';

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodColor: string;
  title: string;
  excerpt: string;
  tag?: string;
  image?: string;
  faded?: boolean;
}

const entries: JournalEntry[] = [
  {
    id: '1',
    date: 'OCTOBER 24, 2023',
    mood: 'Reflective',
    moodColor: '#9a7878',
    title: 'The Silence of Early Mornings',
    excerpt:
      "Today I woke up before the sun. The house was so still, it felt like I could hear my own thoughts breathing. There's a specific kind of peace in the dark before the world demands anything from us.",
    tag: 'Deep Dive',
  },
  {
    id: '2',
    date: 'OCTOBER 21, 2023',
    mood: 'Grateful',
    moodColor: '#7a9a7a',
    title: 'Unexpected Connections',
    excerpt:
      "Met an old friend by chance at the park. We didn't talk much about the past, just the present. It's beautiful how some people feel like home no matter how much time has passed.",
  },
  {
    id: '3',
    date: 'OCTOBER 18, 2023',
    mood: 'Melancholy',
    moodColor: '#7a7a9a',
    title: 'Changing Seasons',
    excerpt:
      "The leaves are turning fast. There's a bit of sadness in seeing things end, but I'm trying to remind myself that it's just nature making space for something new.",
    image: LEAVES_URL,
  },
  {
    id: '4',
    date: 'OCTOBER 15, 2023',
    mood: 'Restless',
    moodColor: '#b09090',
    title: 'Finding Focus',
    excerpt:
      "My mind was all over the place today. Couldn't settle on one thing. Tomorrow, I will try to be more intentional with my time.",
    faded: true,
  },
];

function MoodBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: '500',
        color,
        fontFamily: 'Inter, sans-serif',
        background: `${color}18`,
        borderRadius: '20px',
        padding: '2px 10px',
        letterSpacing: '0.2px',
      }}
    >
      {label}
    </span>
  );
}

export function ReflectionJournalScreen() {
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
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Title */}
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '30px',
            color: '#2d1818',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          Reflections
        </h1>
        <p style={{ fontSize: '13px', color: '#9a7878', fontFamily: 'Inter, sans-serif', marginBottom: '22px' }}>
          A quiet chronicle of your inner world.
        </p>

        {/* Journal entries */}
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => navigate('/create')}
              className="w-full text-left transition-all active:scale-[0.98]"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: '0 2px 12px rgba(100,60,60,0.08)',
                  opacity: entry.faded ? 0.6 : 1,
                }}
              >
                <div className="px-4 pt-4 pb-3">
                  {/* Date + mood row */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#b09090',
                        letterSpacing: '1.2px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                      }}
                    >
                      {entry.date}
                    </span>
                    <MoodBadge label={entry.mood} color={entry.moodColor} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '18px',
                      color: '#2d1818',
                      fontWeight: '600',
                      marginBottom: '8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {entry.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6a5050',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.6,
                      marginBottom: entry.tag || entry.image ? '10px' : '0',
                    }}
                  >
                    {entry.excerpt}
                  </p>

                  {/* Tag */}
                  {entry.tag && (
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8a0a0" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      <span style={{ fontSize: '11px', color: '#b09090', fontFamily: 'Inter, sans-serif' }}>
                        {entry.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Image if present */}
                {entry.image && (
                  <div style={{ height: '130px', overflow: 'hidden' }}>
                    <ImageWithFallback
                      src={entry.image}
                      alt={entry.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Spacer for bottom button */}
        <div style={{ height: '80px' }} />
      </div>

      {/* New Reflection floating button */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ bottom: '78px', zIndex: 30 }}
      >
        <button
          onClick={() => navigate('/create')}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl transition-opacity active:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #5a3535, #3d2020)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 6px 24px rgba(60,30,30,0.35)',
            letterSpacing: '0.1px',
          }}
        >
          New Reflection
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
