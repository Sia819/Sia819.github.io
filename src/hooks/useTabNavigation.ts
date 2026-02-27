'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { TabDef } from '@/lib/tabs';
import { tabIdToPath, pathToTabId } from '@/lib/tabs';

interface HintState {
  tab: TabDef;
  direction: 'up' | 'down';
}

/**
 * 탭 네비게이션 + 콘텐츠 스크롤 휠 로직을 관리하는 훅.
 * usePathname() 기반으로 현재 탭을 판별하고, router.push()로 전환.
 *
 * - 콘텐츠 외부 휠: 탭 전환
 * - 콘텐츠 내부 휠: 직접 스크롤 제어 (scroll latching 우회)
 * - boundary 감지 → 힌트 표시 → 탭 전환
 * - 탭 전환 직후 guard로 과도한 스크롤 방지
 */
const useTabNavigation = (allTabs: readonly TabDef[]) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentTabId = pathToTabId(pathname);

  const [hint, setHint] = useState<HintState | null>(null);

  const wheelCooldown = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const boundaryTime = useRef<number>(0);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabSwitchTime = useRef<number>(0);
  const isNavigating = useRef(false);

  // 탭 전환 함수
  const navigateTab = useCallback(
    (tabId: string) => {
      if (isNavigating.current) return;
      isNavigating.current = true;
      router.push(tabIdToPath(tabId));
      // 네비게이션 후 잠시 뒤 플래그 해제
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);
    },
    [router],
  );

  // pathname 변경 시 스크롤 초기화 + 상태 리셋
  useEffect(() => {
    setHint(null);
    boundaryTime.current = 0;
    tabSwitchTime.current = Date.now();
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [pathname]);

  // 인접 탭 프리패치
  useEffect(() => {
    const idx = allTabs.findIndex((t) => t.id === currentTabId);
    if (idx > 0) {
      router.prefetch(tabIdToPath(allTabs[idx - 1].id));
    }
    if (idx < allTabs.length - 1) {
      router.prefetch(tabIdToPath(allTabs[idx + 1].id));
    }
  }, [currentTabId, allTabs, router]);

  // 키보드 위/아래 화살표 → 탭 전환
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();

      const idx = allTabs.findIndex((t) => t.id === currentTabId);
      if (e.key === 'ArrowDown' && idx < allTabs.length - 1) {
        navigateTab(allTabs[idx + 1].id);
      } else if (e.key === 'ArrowUp' && idx > 0) {
        navigateTab(allTabs[idx - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTabId, allTabs, navigateTab]);

  // 콘텐츠 외부에서 휠 → 탭 전환
  const handleOuterWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelCooldown.current || isNavigating.current) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 10) return;

      const idx = allTabs.findIndex((t) => t.id === currentTabId);
      if (delta > 0 && idx < allTabs.length - 1) {
        navigateTab(allTabs[idx + 1].id);
      } else if (delta < 0 && idx > 0) {
        navigateTab(allTabs[idx - 1].id);
      } else {
        return;
      }

      wheelCooldown.current = true;
      setTimeout(() => {
        wheelCooldown.current = false;
      }, 120);
    },
    [currentTabId, allTabs, navigateTab],
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
      if (e.deltaMode === 1) deltaY *= 40;
      else if (e.deltaMode === 2) deltaY *= el.clientHeight;

      // 탭 전환 직후 guard
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
          const idx = allTabs.findIndex((t) => t.id === currentTabId);
          const target = goDown ? allTabs[idx + 1] : allTabs[idx - 1];
          if (target && !hintTimer.current) {
            const dir = goDown ? ('down' as const) : ('up' as const);
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
      if (hintTimer.current) {
        clearTimeout(hintTimer.current);
        hintTimer.current = null;
      }
      if (hint) setHint(null);
      e.stopPropagation();
    },
    [currentTabId, allTabs, hint],
  );

  return {
    currentTabId,
    hint,
    contentRef,
    handleOuterWheel,
    handleContentWheel,
  };
};

export default useTabNavigation;
