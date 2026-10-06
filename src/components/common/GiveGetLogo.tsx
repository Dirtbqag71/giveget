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

  // The latest Give & Get interlocking exchange arrow ampersand
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
      {/* Upper loop flowing clockwise */}
      <path
        d="M44 48 C36 42 34 33 39 25 C45 16 58 15 66 23 C71 28 72 35 67 42"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower counter loop */}
      <path
        d="M42 48 C34 53 28 62 31 72 C35 83 49 87 60 83 C68 79 73 70 69 62 L63 67"
        stroke={color}
        strokeWidth="10.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower inward arrowhead */}
      <path
        d="M62 59 L74 61 L68 72 Z"
        fill={color}
      />
      {/* Diagonal crossing band pointing upper-right */}
      <path
        d="M34 71 C38 56 56 48 72 42"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Upper-right Arrowhead */}
      <path
        d="M68 33 L82 42 L67 55 Z"
        fill={color}
      />
    </svg>
  );

  // App icon variant: uses the latest blue squircle app icon
  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <img
          src="/give_get_blue_app_icon_latest.svg"
          alt="Give and Get App Icon"
          className="w-full h-full object-contain select-none"
        />
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
