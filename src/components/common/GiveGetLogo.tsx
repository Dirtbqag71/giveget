import React from 'react';

interface GiveGetLogoProps {
  variant?: 'full' | 'wordmark' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBetaBadge?: boolean;
  className?: string;
}

export const GiveGetLogo: React.FC<GiveGetLogoProps> = ({
  variant = 'full',
  size = 'md',
  showBetaBadge = false,
  className = '',
}) => {
  // Dimension tokens
  const iconSizes = {
    sm: { width: 28, height: 28, stroke: 3 },
    md: { width: 36, height: 36, stroke: 3.5 },
    lg: { width: 48, height: 48, stroke: 4 },
    xl: { width: 64, height: 64, stroke: 4.5 },
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const { width, height } = iconSizes[size];

  // The custom Give & Get interlocking exchange arrow ampersand
  const ExchangeAmpersandIcon = ({
    color = '#2563EB',
    sizePx = 32,
  }: {
    color?: string;
    sizePx?: number;
  }) => (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 transition-transform duration-200"
      aria-label="Give and Get Exchange Symbol"
    >
      {/* Upper loop flowing to arrow pointing top-right */}
      <path
        d="M38 72 C 22 66, 16 48, 28 34 C 38 22, 58 20, 68 28 C 76 34, 76 46, 68 52 C 58 60, 44 64, 38 72"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower counter loop with dynamic exchange arrow */}
      <path
        d="M48 48 C 62 44, 76 40, 84 32"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Arrowhead top right */}
      <path
        d="M72 18 L 88 32 L 72 46"
        fill={color}
      />
      {/* Bottom loop tail curving back with arrow pointing inward/forward */}
      <path
        d="M38 72 C 44 80, 58 84, 70 80 C 78 76, 80 68, 76 60 L 64 68"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62 60 L 78 60 L 78 76 Z"
        fill={color}
      />
    </svg>
  );

  // App icon variant (blue rounded background with white interlocking ampersand)
  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl bg-blue-600 shadow-sm text-white overflow-hidden transition-all duration-200 hover:bg-blue-700 ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <ExchangeAmpersandIcon color="#FFFFFF" sizePx={Math.round(width * 0.72)} />
      </div>
    );
  }

  // Full Wordmark + Tagline
  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="inline-flex items-center gap-1.5 leading-none">
        <span
          className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size]}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          give
        </span>
        <div className="relative inline-flex items-center justify-center -my-1">
          <ExchangeAmpersandIcon
            color="#2563EB"
            sizePx={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 42 : 54}
          />
        </div>
        <span
          className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size]}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          get
        </span>

        {showBetaBadge && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Marin Beta
          </span>
        )}
      </div>

      {variant === 'full' && (
        <span
          className={`font-medium text-slate-500 tracking-normal mt-0.5 pl-0.5 ${taglineSizes[size]}`}
          style={{ letterSpacing: '-0.01em' }}
        >
          Give some. Get some.
        </span>
      )}
    </div>
  );
};
