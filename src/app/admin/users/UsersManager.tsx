'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type User = {
  id: number;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
};

export default function UsersManager({
  initialUsers,
  currentUserEmail,
}: {
  initialUsers: User[];
  currentUserEmail: string;
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function reset() {
    setEditingId(null); setEmail(''); setDisplayName(''); setPassword('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);

    if (editingId) {
      // Update existing — password optional
      const body: any = { display_name: displayName };
      if (password) body.password = password;
      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setUsers(users.map((u) => u.id === editingId ? { ...u, display_name: displayName } : u));
        reset();
        setMsg('User updated');
        setTimeout(() => setMsg(null), 2500);
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Update failed');
      }
    } else {
      // Create new
      if (!email || !password) { setErr('Email and password required'); return; }
      if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
      const res = await fetch('/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: displayName }),
      });
      if (res.ok) {
        const j = await res.json();
        setUsers([...users, { id: j.id, email, display_name: displayName, role: 'admin', created_at: new Date().toISOString() }]);
        reset();
        setMsg('User created');
        setTimeout(() => setMsg(null), 2500);
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Create failed');
      }
    }
  }

  function startEdit(u: User) {
    setEditingId(u.id);
    setEmail(u.email);
    setDisplayName(u.display_name || '');
    setPassword('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: number, e: string) {
    if (e === currentUserEmail) { alert("You can't delete yourself."); return; }
    if (users.length <= 1) { alert("You can't delete the last admin user."); return; }
    if (!confirm(`Delete admin user "${e}"? They won't be able to log in.`)) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
    else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Delete failed');
    }
  }

  return (
    <div className="adm-grid-2">
      <div className="adm-card">
        <div className="adm-card-head">
          <h3>{editingId ? 'Edit User' : 'Add Admin User'}</h3>
          {editingId && <button type="button" className="adm-btn-ghost" onClick={reset}>Cancel</button>}
        </div>

        {err && <div className="adm-alert adm-alert-error">{err}</div>}
        {msg && <div className="adm-alert adm-alert-success">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={!!editingId}
            />
            {editingId && <small>Email can&apos;t be changed. Delete and re-add to change email.</small>}
          </div>

          <div className="adm-field">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="adm-field">
            <label>
              Password {!editingId && <span style={{ color: '#ef4444' }}>*</span>}
              {editingId && <small style={{ color: '#94a3b8', fontWeight: 400 }}> (leave empty to keep current)</small>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingId ? 'New password (optional)' : 'At least 6 characters'}
              minLength={editingId ? undefined : 6}
              required={!editingId}
            />
          </div>

          <button type="submit" className="adm-btn-primary" style={{ width: '100%', margin: '0 22px' }}>
            <Icon name={editingId ? 'check' : 'plus'} size={14} />
            {editingId ? 'Update User' : 'Add User'}
          </button>
        </form>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3>All Admin Users ({users.length})</h3>
        </div>
        {users.length === 0 ? (
          <div className="adm-empty">
            <Icon name="users" size={40} />
            <h3>No users</h3>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>Email</th><th>Name</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.email}</strong>
                    {u.email === currentUserEmail && <span className="adm-badge adm-badge-blue" style={{ marginLeft: 8 }}>You</span>}
                  </td>
                  <td className="adm-cell-muted">{u.display_name || '—'}</td>
                  <td><span className="adm-badge adm-badge-purple">{u.role}</span></td>
                  <td className="actions">
                    <div className="adm-actions">
                      <button onClick={() => startEdit(u)} className="adm-act-btn adm-act-edit" title="Edit">
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
                        className="adm-act-btn adm-act-delete"
                        title="Delete"
                        disabled={u.email === currentUserEmail}
                        style={u.email === currentUserEmail ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
