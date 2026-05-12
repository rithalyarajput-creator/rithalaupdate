// /admin  redirect to dashboard (if logged in) or login page.
// Makes "rithalaupdate.online/admin" work like WordPress's /wp-admin.

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminIndex() {
  const session = await getSession();
  if (session) {
    redirect('/admin/dashboard');
  }
  redirect('/admin/login');
}
