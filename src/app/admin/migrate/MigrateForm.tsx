'use client';

import { useState } from 'react';

export default function MigrateForm({ token }: { token: string }) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function runMigration() {
    setRunning(true);
    setErr(null);
    setResults([]);
    const res = await fetch(`/api/migrate?token=${encodeURIComponent(token)}`, {
      method: 'POST',
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setResults(j.results || []);
    } else {
      setErr(j.error || 'Migration failed');
    }
    setRunning(false);
  }

  return (
    <div>
      <button className="btn" onClick={runMigration} disabled={running} style={{ width: '100%' }}>
        {running ? 'Running migration' : ' Run Migration Now'}
      </button>

      {err && <div className="form-error" style={{ marginTop: 16 }}>{err}</div>}

      {results.length > 0 && (
        <div style={{ marginTop: 16, background: '#1a1a1a', color: '#0f0', padding: 12, borderRadius: 6, fontFamily: 'monospace', fontSize: '0.85rem', maxHeight: 400, overflowY: 'auto' }}>
          {results.map((r, i) => (
            <div key={i}>{r}</div>
          ))}
          <div style={{ marginTop: 8, color: '#fff' }}>
             Done! You can now use the new admin features. Close this page.
          </div>
        </div>
      )}
    </div>
  );
}
