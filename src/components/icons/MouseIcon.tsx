import React from 'react';

export const MouseIcon = ({ className = '', children, ...props }: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
  <div className={`relative flex justify-center ${className}`}>
    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: 'var(--text-muted)' }}
      {...props}
    >
      {/* 슬림하고 모던한 마우스 외곽선 */}
      <rect
        x="3"
        y="2"
        width="18"
        height="32"
        rx="9"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
    {children}
  </div>
);