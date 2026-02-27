'use client';

import tabContent from '@/generated/tab-career';
import { ALL_TABS } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

const TAB_DEF = ALL_TABS.find((t) => t.id === 'career')!;

export default function CareerTab() {
  return <TabContentRenderer tab={tabContent} accentColor={TAB_DEF.color} />;
}
