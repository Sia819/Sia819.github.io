'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrollDownHintProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const ScrollDownHint = ({ scrollRef }: ScrollDownHintProps) => {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const dismissed = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setFading(true);
  };

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 800);
    const autoTimer = setTimeout(() => dismiss(), 6000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoTimer);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !visible) return;

    const handle = () => dismiss();
    el.addEventListener('wheel', handle, { once: true, passive: true });
    return () => el.removeEventListener('wheel', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-2 ${fading ? 'scroll-hint-out' : 'scroll-hint-in'}`}
      onAnimationEnd={() => {
        if (fading) setVisible(false);
      }}
    >
      {/* 마우스 아이콘 + 스크롤 휠 애니메이션 */}
      <div className="relative">
        <svg
          width="26"
          height="42"
          viewBox="0 0 26 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: 'var(--text-muted)' }}
        >
          {/* 마우스 본체 */}
          <rect
            x="1"
            y="1"
            width="24"
            height="40"
            rx="12"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* 좌우 버튼 구분선 */}
          <line
            x1="13"
            y1="1"
            x2="13"
            y2="14"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* 스크롤 휠 트랙 (필 모양) */}
          <rect
            x="10"
            y="9"
            width="6"
            height="10"
            rx="3"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.35"
          />
        </svg>
        {/* 스크롤 휠 점 — HTML 요소로 CSS 애니메이션 적용 */}
        <div
          className="scroll-wheel absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            top: 12,
            left: 11,
            backgroundColor: 'var(--text-muted)',
          }}
        />
      </div>

      {/* 아래 화살표 (쉐브론) */}
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="scroll-chevron"
        style={{ color: 'var(--text-muted)' }}
      >
        <path
          d="M2 2L8 8L14 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

export default ScrollDownHint;
