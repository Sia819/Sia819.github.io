'use client';

import { useState, useEffect, useRef } from 'react';
import { MouseIcon } from '@/components/icons/MouseIcon';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { SwipeHintIcon } from '@/components/icons/SwipeHintIcon';

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
    return () => {
      clearTimeout(showTimer);
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

  const animClass = fading ? 'scroll-hint-out' : 'scroll-hint-in';
  const handleAnimEnd = () => { if (fading) setVisible(false); };

  return (
    <>
      {/* 데스크탑: 탭 스트립 왼쪽 (노트북 컨테이너 기준 absolute) */}
      <div
        className={`pointer-events-none absolute right-[72px] top-[15%] z-20 hidden md:flex flex-col items-center gap-1 ${animClass}`}
        onAnimationEnd={handleAnimEnd}
      >
        <div className="flex flex-col items-center gap-1 opacity-80 scale-150">
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
      </div>

      {/* 모바일: 뷰포트 고정 오버레이 (2배 크기) */}
      <div
        className={`pointer-events-none fixed bottom-[17vh] left-0 right-0 z-50 flex md:hidden justify-center ${animClass}`}
        onAnimationEnd={handleAnimEnd}
      >
        <div className="opacity-80 scale-[2]">
          <SwipeHintIcon className="text-[var(--text-muted)]" />
        </div>
      </div>
    </>
  );
};

export default ScrollDownHint;