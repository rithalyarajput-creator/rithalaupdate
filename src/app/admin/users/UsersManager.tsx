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
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function openAdd() {
    setEditingId(null); setEmail(''); setDisplayName(''); setPassword('');
    setShowForm(true);
    setErr(null);
  }

  function startEdit(u: User) {
    setEditingId(u.id);
    setEmail(u.email);
    setDisplayName(u.display_name || '');
    setPassword('');
    setShowForm(true);
    setErr(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null); setEmail(''); setDisplayName(''); setPassword('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);

    if (editingId) {
      const body: any = { display_name: displayName };
      if (password) body.password = password;
      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setUsers(users.map((u) => u.id === editingId ? { ...u, display_name: displayName } : u));
        closeForm();
        setMsg('User updated');
        setTimeout(() => setMsg(null), 2500);
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Update failed');
      }
    } else {
      if (!email || !password) { setErr('Email and password required'); return; }
      if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
      const res = await fetch('/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: displayName }),
      });
      if (res.ok) {
        const j = await res.json();
        setUsers([...users, { id: j.id, email, display_name: displayName, role: 'admin', created_at: new Date().toISOString() }]);
        closeForm();
        setMsg('User created');
        setTimeout(() => setMsg(null), 2500);
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || 'Create failed');
      }
    }
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
    <>
      {msg && <div className="adm-alert adm-alert-success" style={{ margin: '0 0 16px' }}>{msg}</div>}

      <div className="adm-action-bar">
        <button type="button" className="adm-btn-primary" onClick={openAdd}>
          <Icon name="plus" size={14} /> Add Admin User
        </button>
      </div>

      {showForm && (
        <div className="adm-card adm-inline-form">
          <div className="adm-card-head">
            <h3>{editingId ? 'Edit User' : 'Add Admin User'}</h3>
            <button type="button" className="adm-btn-ghost" onClick={closeForm}>
              <Icon name="close" size={13} /> Cancel
            </button>
          </div>
          {err && <div className="adm-alert adm-alert-error">{err}</div>}
          <form onSubmit={handleSubmit}>
            <div className="adm-grid-form">
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
                {editingId && <small>Email can&apos;t be changed.</small>}
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
            <button type="submit" className="adm-btn-primary" style={{ margin: '8px 22px 6px' }}>
              <Icon name={editingId ? 'check' : 'plus'} size={14} />
              {editingId ? 'Update User' : 'Add User'}
            </button>
          </form>
        </div>
      )}

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
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Email</th><th>Name</th><th>Role</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.email}</strong>
                      {u.email === currentUserEmail && <span className="adm-badge adm-badge-blue" style={{ marginLeft: 8 }}>You</span>}
                    </td>
                    <td className="adm-cell-muted">{u.display_name || ''}</td>
                    <td><span className="adm-badge adm-badge-purple">{u.role}</span></td>
                    <td style={{ textAlign: 'right' }}>
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
          </div>
        )}
      </div>
    </>
  );
}
