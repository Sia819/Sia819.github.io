import { ALL_TAB_METAS } from '@/generated/tab-defs';

/* ──────────────────────────────────────────────
 * 탭 정의 (Server/Client 공용)
 *
 * TabButton.tsx('use client')에서도, page.tsx(Server Component)에서도
 * 동일한 탭 데이터를 참조할 수 있도록 분리.
 * ────────────────────────────────────────────── */

export interface TabDef {
  readonly id: string;
  readonly label: string;
  readonly icon: 'home' | 'about' | null;
  readonly color: string;
}

// 콘텐츠 탭 색상 팔레트 (CSS 변수)
const TAB_PALETTE = [
  'var(--tab-palette-1)',
  'var(--tab-palette-2)',
  'var(--tab-palette-3)',
  'var(--tab-palette-4)',
  'var(--tab-palette-5)',
];

const SPECIAL_COLORS: Record<string, string> = {
  home: 'var(--tab-home)',
  about: 'var(--tab-about)',
};

// tab-defs.ts 메타데이터 → TabDef 배열 변환
let contentIndex = 0;
export const ALL_TABS: readonly TabDef[] = ALL_TAB_METAS.map((meta) => {
  if (meta.icon) {
    return {
      id: meta.id,
      label: meta.label,
      icon: meta.icon,
      color: SPECIAL_COLORS[meta.id] || 'var(--tab-home)',
    };
  }
  const color = TAB_PALETTE[contentIndex % TAB_PALETTE.length];
  contentIndex++;
  return { id: meta.id, label: meta.label, icon: null, color };
});

export const ALL_TAB_IDS = ALL_TABS.map((t) => t.id);
export const HOME_TAB = ALL_TABS.find((t) => t.id === 'home')!;
export const ABOUT_TAB = ALL_TABS.find((t) => t.id === 'about')!;
export const CONTENT_TABS = ALL_TABS.filter((t) => !t.icon);

// tabId → URL 경로 변환
export const tabIdToPath = (tabId: string): string => {
  return tabId === 'home' ? '/' : `/${tabId}/`;
};

// URL pathname → tabId 변환
export const pathToTabId = (pathname: string): string => {
  const cleaned = pathname.replace(/^\/|\/$/g, '');
  return cleaned || 'home';
};
