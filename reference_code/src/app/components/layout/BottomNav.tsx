import { useNavigate, useLocation } from 'react-router';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V9.5Z"
      stroke={active ? '#5a3535' : '#b09090'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? '#5a3535' : 'none'}
    />
  </svg>
);

const JournalIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect
      x="4" y="3" width="13" height="18" rx="2"
      stroke={active ? '#5a3535' : '#b09090'}
      strokeWidth="1.8"
      fill={active ? '#5a3535' : 'none'}
    />
    <path d="M17 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H17" stroke={active ? '#5a3535' : '#b09090'} strokeWidth="1.8"/>
    <path d="M8 8H13M8 12H13M8 16H11" stroke={active ? 'white' : '#b09090'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const InsightsIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={active ? '#5a3535' : '#b09090'} strokeWidth="1.8" fill={active ? '#5a3535' : 'none'}/>
    <path d="M7 16L10 11L13 13L17 8" stroke={active ? 'white' : '#b09090'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={active ? '#5a3535' : '#b09090'} strokeWidth="1.8" fill={active ? '#5a3535' : 'none'}/>
    <path d="M4 20C4 17 7.6 14.5 12 14.5C16.4 14.5 20 17 20 20" stroke={active ? '#5a3535' : '#b09090'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const navItems = [
  { label: 'Home', path: '/chat', Icon: HomeIcon },
  { label: 'Journal', path: '/journal', Icon: JournalIcon },
  { label: 'Insights', path: '/insights', Icon: InsightsIcon },
  { label: 'Profile', path: '/profile', Icon: ProfileIcon },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex items-center justify-around px-2 pt-2 pb-1"
      style={{
        background: 'rgba(240, 219, 217, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(180,130,130,0.2)',
        height: '70px',
        flexShrink: 0,
      }}
    >
      {navItems.map(({ label, path, Icon }) => {
        const active =
          location.pathname === path ||
          (path === '/chat' && location.pathname === '/') ||
          (path === '/journal' && location.pathname === '/create');
        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-0.5 flex-1 py-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Icon active={active} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: active ? '600' : '400',
                color: active ? '#5a3535' : '#b09090',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}