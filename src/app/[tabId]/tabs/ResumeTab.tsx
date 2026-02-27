'use client';

import tabContent from '@/generated/tab-resume';
import { ALL_TABS } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

const TAB_DEF = ALL_TABS.find((t) => t.id === 'resume')!;

export default function ResumeTab() {
  return <TabContentRenderer tab={tabContent} accentColor={TAB_DEF.color} />;
}
