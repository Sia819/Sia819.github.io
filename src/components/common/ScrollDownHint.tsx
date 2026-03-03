'use client';

import { useState, useEffect, useRef } from 'react';
import { MouseIcon } from '@/components/icons/MouseIcon';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { SwipeTrackIcon } from '@/components/icons/SwipeTrackIcon';

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
    el.addEventListener('touchstart', handle, { once: true, passive: true });
    return () => {
      el.removeEventListener('wheel', handle);
      el.removeEventListener('touchstart', handle);
    };
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
      {/* 데스크탑: 마우스 아이콘 + 스크롤 휠 애니메이션 */}
      <div className="hidden md:flex flex-col items-center gap-1 opacity-80">
        <MouseIcon>
          <div
            className="scroll-wheel absolute rounded-full"
            style={{
              width: 2.5,
              height: 6,
              top: 7,
              left: 10.75,
              backgroundColor: 'var(--text-muted)',
              boxShadow: '0 0 2px var(--text-muted)'
            }}
          />
        </MouseIcon>
        <ChevronIcon direction="down" className="scroll-chevron mt-1" />
      </div>

      {/* 모바일: 스와이프 힌트 */}
      <div className="flex md:hidden items-center gap-3 opacity-80">
        <ChevronIcon direction="left" className="swipe-chevron-left" />
        <SwipeTrackIcon>
          <div
            className="swipe-dot absolute rounded-full"
            style={{
              width: 5,
              height: 5,
              top: 7.5,
              left: 17.5,
              backgroundColor: 'var(--text-muted)',
              boxShadow: '0 0 3px var(--text-muted)'
            }}
          />
        </SwipeTrackIcon>
        <ChevronIcon direction="right" className="swipe-chevron-right" />
      </div>
    </div>
  );
};

export default ScrollDownHint;