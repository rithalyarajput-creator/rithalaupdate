'use client';
import { useLang } from '@/context/LanguageContext';

interface Props {
  hi: string;
  en: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function BiText({ hi, en, as: Tag = 'span', className }: Props) {
  const { lang } = useLang();
  return <Tag className={className}>{lang === 'hi' ? hi : en}</Tag>;
}
