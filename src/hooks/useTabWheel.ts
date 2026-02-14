import { useState, useCallback, useRef, useEffect } from 'react';

interface TabDef {
  readonly id: string;
  readonly label: string;
  readonly icon: 'home' | 'settings' | null;
  readonly color: string;
}

interface HintState {
  tab: TabDef;
  direction: 'up' | 'down';
}

/**
 * 탭 전환 + 콘텐츠 스크롤 휠 로직을 관리하는 훅.
 *
 * - 콘텐츠 외부 휠: 탭 전환
 * - 콘텐츠 내부 휠: 직접 스크롤 제어 (scroll latching 우회)
 * - boundary 감지 → 힌트 표시 → 탭 전환
 * - 탭 전환 직후 guard로 과도한 스크롤 방지
 */
const useTabWheel = (allTabs: readonly TabDef[], initialTabId: string) => {
  const [activeTab, setActiveTab] = useState(initialTabId);
  const [hint, setHint] = useState<HintState | null>(null);

  const wheelCooldown = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const boundaryTime = useRef<number>(0);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabSwitchTime = useRef<number>(0);

  // 탭 변경 시 스크롤 초기화
  useEffect(() => {
    setHint(null);
    boundaryTime.current = 0;
    tabSwitchTime.current = Date.now();
    if (hintTimer.current) { clearTimeout(hintTimer.current); hintTimer.current = null; }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTab]);

  // 콘텐츠 외부에서 휠 → 탭 전환
  const handleOuterWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelCooldown.current) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 10) return;

      const idx = allTabs.findIndex((t) => t.id === activeTab);
      if (delta > 0 && idx < allTabs.length - 1) {
        setActiveTab(allTabs[idx + 1].id);
      } else if (delta < 0 && idx > 0) {
        setActiveTab(allTabs[idx - 1].id);
      } else {
        return;
      }

      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 120);
    },
    [activeTab, allTabs],
  );

  // 콘텐츠 내부에서 휠 → 직접 스크롤 + boundary 감지
  const handleContentWheel = useCallback(
    (e: React.WheelEvent) => {
      const el = e.currentTarget as HTMLDivElement;
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (!isScrollable) return;

      // 네이티브 스크롤 대신 직접 제어 (브라우저 scroll latching 우회)
      e.preventDefault();

      // deltaY를 픽셀로 정규화
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 40;            // lines → px
      else if (e.deltaMode === 2) deltaY *= el.clientHeight; // pages → px

      // 탭 전환 직후 guard (와라락 방지)
      if (Date.now() - tabSwitchTime.current < 500) {
        e.stopPropagation();
        return;
      }

      const atTop = el.scrollTop <= 0;
      const atBtm = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      const goDown = deltaY > 0;
      const atBoundary = (goDown && atBtm) || (!goDown && atTop);

      if (atBoundary) {
        if (!boundaryTime.current) {
          boundaryTime.current = Date.now();
          const idx = allTabs.findIndex((t) => t.id === activeTab);
          const target = goDown ? allTabs[idx + 1] : allTabs[idx - 1];
          if (target && !hintTimer.current) {
            const dir = goDown ? 'down' as const : 'up' as const;
            hintTimer.current = setTimeout(() => setHint({ tab: target, direction: dir }));
          }
        }
        if (Date.now() - boundaryTime.current < 400) {
          e.stopPropagation();
        }
        return;
      }

      // 일반 스크롤: 직접 스크롤 수행 + boundary 타이머 초기화
      el.scrollBy(0, deltaY);
      boundaryTime.current = 0;
      if (hintTimer.current) { clearTimeout(hintTimer.current); hintTimer.current = null; }
      if (hint) setHint(null);
      e.stopPropagation();
    },
    [activeTab, allTabs, hint],
  );

  return {
    activeTab,
    setActiveTab,
    hint,
    contentRef,
    handleOuterWheel,
    handleContentWheel,
  };
};

export default useTabWheel;
