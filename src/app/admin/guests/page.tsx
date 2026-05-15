import { sql } from '@/lib/db';
import AdminShell from '@/components/AdminShell';
import GuestsManager from './GuestsManager';

export const revalidate = 0;

export default async function GuestsPage() {
  let submissions: any[] = [];
  let tableExists = true;
  let unreadCount = 0;

  try {
    await sql`ALTER TABLE guest_submissions ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE`;
    const r = await sql`SELECT * FROM guest_submissions ORDER BY created_at DESC`;
    submissions = r.rows;
    unreadCount = submissions.filter((s) => !s.is_read).length;
  } catch {
    tableExists = false;
  }

  return (
    <AdminShell email="" newGuests={unreadCount}>
      <GuestsManager submissions={submissions} tableExists={tableExists} />
    </AdminShell>
  );
}
