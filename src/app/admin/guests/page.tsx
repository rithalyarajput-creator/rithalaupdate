import { sql } from '@/lib/db';
import AdminShell from '@/components/AdminShell';
import GuestsManager from './GuestsManager';

export const revalidate = 0;

export default async function GuestsPage() {
  let submissions: any[] = [];
  let tableExists = true;
  try {
    const r = await sql`SELECT * FROM guest_submissions ORDER BY created_at DESC`;
    submissions = r.rows;
  } catch {
    tableExists = false;
  }

  return (
    <AdminShell active="guests">
      <GuestsManager submissions={submissions} tableExists={tableExists} />
    </AdminShell>
  );
}
