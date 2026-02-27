'use client';

import tabContent from '@/generated/tab-introduction';
import { ALL_TABS } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

const TAB_DEF = ALL_TABS.find((t) => t.id === 'introduction')!;

export default function IntroductionTab() {
  return <TabContentRenderer tab={tabContent} accentColor={TAB_DEF.color} />;
}
