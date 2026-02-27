'use client';

import tabContent from '@/generated/tab-home';
import { HOME_TAB } from '@/lib/tabs';
import TabContentRenderer from '@/components/sections/TabContentRenderer';

export default function HomePage() {
  return <TabContentRenderer tab={tabContent} accentColor={HOME_TAB.color} />;
}
