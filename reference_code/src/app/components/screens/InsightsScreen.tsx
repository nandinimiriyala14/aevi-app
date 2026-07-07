import { BottomNav } from '../layout/BottomNav';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer } from 'recharts';

const AVATAR_URL = 'https://images.unsplash.com/photo-1617397303021-f68bae9f29d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc29mdCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzcwMzk2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080';

const moodData = [
  { day: 'M', value: 35, shade: '#c8a0a0' },
  { day: 'T', value: 55, shade: '#b08080' },
  { day: 'W', value: 42, shade: '#b89090' },
  { day: 'T', value: 70, shade: '#9a7070' },
  { day: 'F', value: 88, shade: '#7a5555' },
  { day: 'S', value: 62, shade: '#9a7070' },
  { day: 'S', value: 48, shade: '#b09090' },
];

const echoTags = ['Presence', 'Gentle Progress', 'Patience', 'Morning Stillness', 'Connection'];

export function InsightsScreen() {
  const navigate = useNavigate();

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
          Insights
        </h1>
        <p style={{ fontSize: '13px', color: '#9a7878', fontFamily: 'Inter, sans-serif', marginBottom: '18px', lineHeight: 1.5 }}>
          Your emotional landscape has been quiet and<br />evolving this week.
        </p>

        {/* Section label */}
        <p style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginBottom: '10px' }}>
          WEEKLY REFLECTION
        </p>

        {/* Mood chart card */}
        <div
          className="rounded-2xl p-4 mb-3"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(100,60,60,0.08)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#4d3030', fontFamily: 'Inter, sans-serif' }}>
              Mood Waves
            </span>
            <div
              className="px-3 py-1 rounded-full"
              style={{ background: '#fde8e8' }}
            >
              <span style={{ fontSize: '12px', color: '#9a5555', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
                Steady Growth
              </span>
            </div>
          </div>
          <div style={{ height: '100px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} barSize={22} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#b09090', fontFamily: 'Inter, sans-serif' }}
                />
                <Bar dataKey="value" radius={[5, 5, 2, 2]}>
                  {moodData.map((entry, index) => (
                    <Cell key={index} fill={entry.shade} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recurring Echoes */}
        <div
          className="rounded-2xl p-4 mb-3"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(100,60,60,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#4d3030', fontFamily: 'Inter, sans-serif' }}>
              Recurring Echoes
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {echoTags.map((tag, i) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: i === 1 ? 'linear-gradient(135deg, #8a6060, #6a4040)' : '#f5eeec',
                  color: i === 1 ? 'white' : '#5a3535',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: i === 1 ? '500' : '400',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div
            className="rounded-2xl p-4"
            style={{ background: '#f5eeec', boxShadow: '0 1px 6px rgba(100,60,60,0.06)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7878" strokeWidth="1.8" strokeLinecap="round" className="mb-2">
              <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#2d1818', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
              Quiet Resolve
            </p>
            <p style={{ fontSize: '11px', color: '#9a7878', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
              Focusing on breath.
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, #5a3535, #3d2020)', boxShadow: '0 2px 12px rgba(60,30,30,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="mb-2">
              <path d="M12 1L13.8 10.2L23 12L13.8 13.8L12 23L10.2 13.8L1 12L10.2 10.2Z"/>
            </svg>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'white', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
              Daily Bloom
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
              Consistent journaling.
            </p>
          </div>
        </div>

        {/* Observations */}
        <p style={{ fontSize: '10px', color: '#b09090', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginBottom: '10px' }}>
          OBSERVATIONS
        </p>

        {/* Warning card */}
        <div
          className="flex items-start gap-3 rounded-2xl p-4 mb-3"
          style={{ background: '#fde8e8', border: '1px solid rgba(200,140,140,0.2)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c87878" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ fontSize: '13px', color: '#7a4545', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
            You seem more anxious on Sundays. Consider a soft evening ritual.
          </p>
        </div>

        {/* Weekly mantra */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: 'linear-gradient(135deg, #3d2828, #2d1818)',
            boxShadow: '0 4px 16px rgba(40,20,20,0.35)',
          }}
        >
          <p
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '17px',
              color: 'white',
              lineHeight: 1.5,
              fontStyle: 'italic',
              marginBottom: '10px',
            }}
          >
            "True growth is often as quiet as the falling dew."
          </p>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
            — WEEKLY MANTRA
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  );
}