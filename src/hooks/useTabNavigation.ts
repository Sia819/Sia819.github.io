'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { TabDef } from '@/lib/tabs';
import { tabIdToPath, pathToTabId } from '@/lib/tabs';
import { prefetchDebug } from './prefetch-debug';

interface HintState {
  tab: TabDef;
  direction: 'up' | 'down';
}

// LRU 프리패치 캐시 — Map 삽입 순서를 활용한 최소 구현
const MAX_PREFETCH_CACHE = 10;
const prefetchCache = new Map<string, number>(); // path → timestamp (삽입 순서 = LRU 순서)

const prefetchLRU = {
  has(path: string): boolean {
    return prefetchCache.has(path);
  },
  /** 캐시에 추가. 이미 있으면 최신으로 갱신. 초과 시 가장 오래된 항목 제거. */
  add(path: string, protectedPaths?: Set<string>): void {
    // 이미 있으면 삭제 후 끝에 재삽입 (touch)
    if (prefetchCache.has(path)) {
      prefetchCache.delete(path);
    }
    prefetchCache.set(path, Date.now());

    // 초과 시 보호 대상이 아닌 가장 오래된 항목 제거
    if (prefetchCache.size > MAX_PREFETCH_CACHE) {
      for (const [oldest] of prefetchCache) {
        if (protectedPaths?.has(oldest)) continue;
        prefetchCache.delete(oldest);
        prefetchDebug.logEvict(oldest, prefetchCache.size, MAX_PREFETCH_CACHE);
        break;
      }
    }
  },
  entries(): string[] {
    return [...prefetchCache.keys()];
  },
  get size(): number {
    return prefetchCache.size;
  },
  touch(path: string): void {
    if (prefetchCache.has(path)) {
      const ts = prefetchCache.get(path)!;
      prefetchCache.delete(path);
      prefetchCache.set(path, ts);
    }
  },
};

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

      const targetPath = tabIdToPath(tabId);
      prefetchDebug.logNavigate(tabId, targetPath, prefetchLRU.has(targetPath));

      // 전환 대상을 LRU에서 최신으로 갱신 (eviction 방지)
      prefetchLRU.touch(targetPath);

      router.push(targetPath);
      // 네비게이션 후 잠시 뒤 플래그 해제
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);
    },
    [router],
  );

  // pathname 변경 시 스크롤 초기화 + 상태 리셋
  useEffect(() => {
    prefetchDebug.logRender(pathname, prefetchLRU.has(pathname));
    setHint(null);
    boundaryTime.current = 0;
    tabSwitchTime.current = Date.now();
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [pathname]);

  // 인접 탭 프리패치 (LRU 캐시 기반)
  useEffect(() => {
    const idx = allTabs.findIndex((t) => t.id === currentTabId);

    // 현재 탭 + 인접 탭은 eviction 보호
    const protectedPaths = new Set<string>();
    protectedPaths.add(tabIdToPath(currentTabId));
    if (idx > 0) protectedPaths.add(tabIdToPath(allTabs[idx - 1].id));
    if (idx < allTabs.length - 1) protectedPaths.add(tabIdToPath(allTabs[idx + 1].id));

    // 현재 탭을 LRU에서 최신으로 갱신
    prefetchLRU.touch(tabIdToPath(currentTabId));

    const tryPrefetch = (tabIdx: number, direction: string) => {
      const tab = allTabs[tabIdx];
      if (!tab) return;
      const path = tabIdToPath(tab.id);
      if (prefetchLRU.has(path)) return;

      prefetchDebug.logPrefetch(path, tab.id, direction);
      router.prefetch(path);
      prefetchLRU.add(path, protectedPaths);
      prefetchDebug.logCacheState(prefetchLRU.entries(), prefetchLRU.size, MAX_PREFETCH_CACHE);
    };

    tryPrefetch(idx - 1, '↑');
    tryPrefetch(idx + 1, '↓');
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
  // 네이티브 addEventListener로 { passive: false } 지정 (React onWheel은 passive라 preventDefault 불가)
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
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
      setHint(null);
      e.stopPropagation();
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [currentTabId, allTabs]);

  return {
    currentTabId,
    hint,
    contentRef,
    handleOuterWheel,
    navigateTab,
  };
};

export default useTabNavigation;
