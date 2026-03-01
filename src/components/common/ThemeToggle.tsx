'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center rounded-full"
        style={{ width: '40px', height: '40px' }}
        aria-label="Toggle Theme Placeholder"
      />
    );
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="sidebar-btn relative flex items-center justify-center rounded-full"
      style={{
        width: '40px',
        height: '40px',
        color: 'var(--sidebar-btn-text)',
        backgroundColor: 'var(--sidebar-btn-bg)',
      }}
      aria-label="Toggle Theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isDark ? 'rotate(-90deg)' : 'rotate(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        <mask id="moon-mask">
          {/* 전체를 보이게 하는 흰색 배경 */}
          <rect x="0" y="0" width="24" height="24" fill="white" />
          {/* 달의 그림자 부분을 투명하게 뚫어내는 검은색 원 */}
          <circle
            cx="16"
            cy="8"
            r={isDark ? "6" : "0"}
            fill="black"
            style={{
              transition: 'r 0.5s ease',
            }}
          />
        </mask>

        {/* 중앙 원 (해일 땐 크고, 달일 땐 작아짐) - 마스크 적용 */}
        <circle
          cx="12"
          cy="12"
          r={isDark ? "8" : "5"}
          fill={isDark ? "currentColor" : "none"}
          mask="url(#moon-mask)"
          style={{
            transition: 'r 0.5s ease',
          }}
        />

        {/* 해의 빛줄기 (다크모드일 땐 축소되어 사라짐) */}
        <g
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'scale(0.5)' : 'scale(1)',
            transformOrigin: 'center',
            transition: 'opacity 0.3s ease, transform 0.5s ease',
          }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </button>
  );
};

export default ThemeToggle;
