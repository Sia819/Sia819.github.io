import React from 'react';

export const SwipeTrackIcon = ({ className = '', children, ...props }: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
  <div className={`relative flex justify-center items-center ${className}`}>
    <svg
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'var(--text-muted)' }}
      {...props}
    >
      {/* 초슬림 라인 트랙 */}
      <line
        x1="4"
        y1="10"
        x2="36"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
    {children}
  </div>
);