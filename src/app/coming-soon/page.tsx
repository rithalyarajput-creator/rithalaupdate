import type { Metadata } from 'next';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = {
  title: 'Rithala Update — Launching 17 May 2025',
  description: 'Rithala Village ka official digital platform jald aa raha hai. 17 May 2025 ko launch hoga.',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoonClient />;
}
