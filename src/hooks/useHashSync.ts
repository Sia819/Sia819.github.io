import { useEffect, useRef, useCallback } from 'react';

/**
 * URL 해시와 탭/스크롤 상태를 동기화하는 훅.
 *
 * - 초기 로드: URL 해시에서 탭/heading 복원
 * - 탭/스크롤 변경: URL 해시 자동 갱신 (replaceState)
 * - 브라우저 hashchange: 탭/스크롤 동기화
 */
const useHashSync = (
  activeTab: string,
  setActiveTab: (id: string) => void,
  contentRef: React.RefObject<HTMLDivElement | null>,
  allTabIds: readonly string[],
) => {
  const isTabSwitching = useRef(false);
  const currentHeadingId = useRef('');
  const skipHashUpdate = useRef(true);
  const pendingScroll = useRef<string | null>(null);

  const parseHash = useCallback((hash: string) => {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!raw) return { tabId: null, headingId: null };
    const decoded = decodeURIComponent(raw);
    const slashIdx = decoded.indexOf('/');
    if (slashIdx === -1) return { tabId: decoded, headingId: null };
    return { tabId: decoded.slice(0, slashIdx), headingId: decoded.slice(slashIdx + 1) };
  }, []);

  // A. 초기 로드 시 해시 파싱
  useEffect(() => {
    const { tabId, headingId } = parseHash(window.location.hash);
    if (tabId && allTabIds.includes(tabId)) {
      if (headingId) pendingScroll.current = headingId;
      setActiveTab(tabId);
    }
    // setTimeout으로 첫 activeTab effect가 해시를 덮어쓰지 않도록 보장
    setTimeout(() => {
      skipHashUpdate.current = false;
    }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // B. activeTab 변경 → 해시 업데이트 + pending heading scroll
  useEffect(() => {
    isTabSwitching.current = true;
    currentHeadingId.current = '';

    if (!skipHashUpdate.current) {
      history.replaceState(null, '', `#${activeTab}`);
    }

    // pending heading이 있으면 렌더 후 스크롤
    if (pendingScroll.current) {
      const headingId = pendingScroll.current;
      pendingScroll.current = null;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const container = contentRef.current;
          if (!container) return;
          const el = container.querySelector(`#${CSS.escape(headingId)}`);
          if (el) {
            el.scrollIntoView({ block: 'start' });
            currentHeadingId.current = headingId;
            history.replaceState(null, '', `#${activeTab}/${headingId}`);
          }
        });
      });
    }

    const timer = setTimeout(() => {
      isTabSwitching.current = false;
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab, contentRef]);

  // C. IntersectionObserver로 현재 heading 감지 → 해시 갱신
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isTabSwitching.current) return;

        const intersecting = entries
          .filter((e) => e.isIntersecting && e.target.id)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          const headingId = intersecting[0].target.id;
          if (headingId !== currentHeadingId.current) {
            currentHeadingId.current = headingId;
            history.replaceState(null, '', `#${activeTab}/${headingId}`);
          }
        }
      },
      {
        root: container,
        rootMargin: '0px 0px -80% 0px',
      },
    );

    // 콘텐츠 렌더 후 heading observe
    const timerId = setTimeout(() => {
      const headings = container.querySelectorAll('h1[id], h2[id], h3[id]');
      headings.forEach((h) => observer.observe(h));
    }, 100);

    return () => {
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, [activeTab, contentRef]);

  // D. hashchange 이벤트 (브라우저 URL 직접 변경 등)
  useEffect(() => {
    const handleHashChange = () => {
      const { tabId, headingId } = parseHash(window.location.hash);
      if (!tabId || !allTabIds.includes(tabId)) return;

      if (tabId !== activeTab) {
        if (headingId) pendingScroll.current = headingId;
        skipHashUpdate.current = true;
        setActiveTab(tabId);
        setTimeout(() => {
          skipHashUpdate.current = false;
        }, 0);
      } else if (headingId) {
        const container = contentRef.current;
        if (!container) return;
        const el = container.querySelector(`#${CSS.escape(headingId)}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab, allTabIds, contentRef, parseHash, setActiveTab]);
};

export default useHashSync;
