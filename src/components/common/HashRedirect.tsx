'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ALL_TAB_IDS, tabIdToPath } from '@/lib/tabs';

/**
 * 레거시 해시 URL(/#resume, /#resume/기술-스택)을
 * 새 경로(/resume/, /resume/#기술-스택)로 리다이렉트.
 */
const HashRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 루트 경로에서만 해시 리다이렉트 처리
    if (pathname !== '/') return;

    const hash = window.location.hash;
    if (!hash) return;

    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!raw) return;

    const decoded = decodeURIComponent(raw);
    const slashIdx = decoded.indexOf('/');

    let tabId: string;
    let headingId: string | null = null;

    if (slashIdx === -1) {
      tabId = decoded;
    } else {
      tabId = decoded.slice(0, slashIdx);
      headingId = decoded.slice(slashIdx + 1);
    }

    if (!ALL_TAB_IDS.includes(tabId)) return;

    const newPath = tabIdToPath(tabId) + (headingId ? `#${headingId}` : '');
    router.replace(newPath);
  }, [pathname, router]);

  return null;
};

export default HashRedirect;
