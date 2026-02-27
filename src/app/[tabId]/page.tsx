import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_TAB_METAS } from '@/generated/tab-defs';
import { TAB_CONTENT_MAP } from '@/generated/tab-content-map';
import { ALL_TABS } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

// 정적 경로에서 제외할 탭 (home은 루트 / 에서 처리)
const EXCLUDED_IDS = new Set(['home']);

// 빌드 타임에 모든 탭 경로를 정적 HTML로 생성
export function generateStaticParams() {
  return ALL_TAB_METAS
    .filter((meta) => !EXCLUDED_IDS.has(meta.id))
    .map((meta) => ({ tabId: meta.id }));
}

// 탭별 메타데이터 생성
export async function generateMetadata(
  { params }: { params: Promise<{ tabId: string }> },
): Promise<Metadata> {
  const { tabId } = await params;
  const meta = ALL_TAB_METAS.find((m) => m.id === tabId);
  if (!meta) return {};

  const title = meta.label
    ? `${meta.label} - Soung-Gyu Jin`
    : 'Soung-Gyu Jin - Portfolio';

  return {
    title,
    description: meta.description || 'Soung-Gyu Jin Portfolio & Blog',
    openGraph: {
      title,
      description: meta.description || 'Soung-Gyu Jin Portfolio & Blog',
      type: 'website',
    },
  };
}

export default async function TabPage({ params }: { params: Promise<{ tabId: string }> }) {
  const { tabId } = await params;

  // /home 접근 시 루트로 리다이렉트
  if (tabId === 'home') {
    redirect('/');
  }

  const tabContent = TAB_CONTENT_MAP[tabId];
  if (!tabContent) {
    notFound();
  }

  const tabDef = ALL_TABS.find((t) => t.id === tabId);
  const accentColor = tabDef?.color ?? 'var(--tab-palette-1)';

  return <TabContentRenderer tab={tabContent} accentColor={accentColor} />;
}
