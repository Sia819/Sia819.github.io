import React from 'react';

interface ChevronIconProps extends React.SVGProps<SVGSVGElement> {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ChevronIcon = ({ direction = 'down', className = '', ...props }: ChevronIconProps) => {
  const getPath = () => {
    switch (direction) {
      case 'up':
        return 'M18 15L12 9L6 15';
      case 'left':
        return 'M15 18L9 12L15 6';
      case 'right':
        return 'M9 18L15 12L9 6';
      case 'down':
      default:
        return 'M6 9L12 15L18 9';
    }
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'var(--text-muted)' }}
      className={className}
      {...props}
    >
      <path
        d={getPath()}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'down' ? '0.6' : undefined} // 데스크탑 하단 쉐브론용 투명도. 모바일은 CSS 애니메이션 제어
      />
    </svg>
  );
};