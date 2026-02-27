'use client';

import tabContent from '@/generated/tab-about';
import { ALL_TABS } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

const TAB_DEF = ALL_TABS.find((t) => t.id === 'about')!;

export default function AboutTab() {
  return <TabContentRenderer tab={tabContent} accentColor={TAB_DEF.color} />;
}
