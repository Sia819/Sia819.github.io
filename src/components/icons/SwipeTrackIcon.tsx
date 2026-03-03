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
      {/* 슬림하고 모던한 스와이프 트랙 */}
      <rect
        x="2"
        y="4"
        width="36"
        height="12"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
    {children}
  </div>
);