import { Outlet } from 'react-router';

export function MobileFrame() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-8"
      style={{ background: 'linear-gradient(135deg, #d4b8b5 0%, #c9aeab 100%)', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Phone frame */}
      <div
        className="relative shadow-2xl flex-shrink-0"
        style={{
          width: '390px',
          height: '844px',
          borderRadius: '50px',
          background: '#f0dbd9',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(80,40,40,0.35), 0 0 0 1px rgba(120,80,80,0.15)',
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute z-50 left-1/2 -translate-x-1/2"
          style={{
            top: '12px',
            width: '120px',
            height: '34px',
            background: '#1a0a0a',
            borderRadius: '20px',
          }}
        />

        {/* Status bar text */}
        <div className="absolute top-0 left-0 right-0 h-[50px] flex items-end justify-between px-7 pb-1 z-40 pointer-events-none">
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#3d2020', fontFamily: 'Inter, sans-serif' }}>9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal bars */}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="0" y="8" width="3" height="4" rx="0.8" fill="#3d2020"/>
              <rect x="5" y="5" width="3" height="7" rx="0.8" fill="#3d2020"/>
              <rect x="10" y="2" width="3" height="10" rx="0.8" fill="#3d2020"/>
              <rect x="15" y="0" width="3" height="12" rx="0.8" fill="#3d2020"/>
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5L9.5 11.5L8 11.5L6.5 11.5L8 9.5Z" fill="#3d2020"/>
              <path d="M4.5 7C5.7 5.8 7 5.3 8 5.3C9 5.3 10.3 5.8 11.5 7" stroke="#3d2020" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M2 4.5C4.1 2.4 6.1 1.5 8 1.5C9.9 1.5 11.9 2.4 14 4.5" stroke="#3d2020" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </svg>
            {/* Battery */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#3d2020" strokeOpacity="0.35"/>
              <rect x="2" y="2" width="16" height="8" rx="2" fill="#3d2020"/>
              <path d="M23 4V8C23.8 7.5 24.5 6.8 24.5 6C24.5 5.2 23.8 4.5 23 4Z" fill="#3d2020" fillOpacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* Content area */}
        <div
          className="absolute left-0 right-0 overflow-y-auto overflow-x-hidden"
          style={{
            top: '50px',
            bottom: 0,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
