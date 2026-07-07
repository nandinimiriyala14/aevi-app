interface AeviLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function AeviLogo({ size = 'md', showText = true }: AeviLogoProps) {
  const circleSize = size === 'sm' ? 52 : size === 'md' ? 70 : 90;
  const ringSize = circleSize * 1.7;
  const starSize = size === 'sm' ? 18 : size === 'md' ? 26 : 34;
  const fontSize = size === 'sm' ? '32px' : size === 'md' ? '44px' : '58px';

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
        {/* Outer ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: ringSize,
            height: ringSize,
            border: '1.5px solid rgba(160,100,100,0.3)',
          }}
        />
        {/* Inner circle with sparkle */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: circleSize,
            height: circleSize,
            background: 'radial-gradient(circle at 35% 35%, #9a6868, #7a5050)',
            boxShadow: '0 4px 16px rgba(120,70,70,0.35)',
          }}
        >
          <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill="white">
            <path d="M12 1L13.8 10.2L23 12L13.8 13.8L12 23L10.2 13.8L1 12L10.2 10.2Z" />
          </svg>
        </div>
      </div>

      {showText && (
        <div
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize,
            color: '#2d1818',
            fontStyle: 'italic',
            fontWeight: 600,
            letterSpacing: '-1px',
            marginTop: '-6px',
            lineHeight: 1,
          }}
        >
          Aevi
        </div>
      )}
    </div>
  );
}
