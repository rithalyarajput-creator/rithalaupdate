// One-time admin setup page.
// Visit /admin/setup?token=YOUR_SETUP_TOKEN to create or reset the admin user.
// Disable by removing ADMIN_SETUP_TOKEN from Vercel env vars after first use.

import SetupForm from './SetupForm';

export const metadata = {
  title: 'Setup — Rithala Admin',
  robots: { index: false, follow: false },
};

export default function SetupPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const tokenProvided = searchParams.token;
  const expectedToken = process.env.ADMIN_SETUP_TOKEN;

  // Block access if env token not configured or doesn't match
  if (!expectedToken) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1 style={{ color: '#c11' }}>🔒 Setup Disabled</h1>
          <p style={{ textAlign: 'center', color: '#666' }}>
            <code>ADMIN_SETUP_TOKEN</code> environment variable not set on Vercel.
          </p>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
            Add it in Vercel → Settings → Environment Variables to enable this page.
          </p>
        </div>
      </div>
    );
  }

  if (tokenProvided !== expectedToken) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1 style={{ color: '#c11' }}>🔒 Access Denied</h1>
          <p style={{ textAlign: 'center', color: '#666' }}>
            Invalid or missing setup token.
          </p>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
            Visit <code>/admin/setup?token=YOUR_TOKEN</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🚩 Rithala Admin Setup</h1>
        <p style={{ textAlign: 'center', color: '#666', marginTop: -8 }}>
          Create or reset the admin user
        </p>
        <SetupForm token={tokenProvided} />
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 16, textAlign: 'center' }}>
          ⚠️ After first use, remove <code>ADMIN_SETUP_TOKEN</code> from Vercel
          to disable this page permanently.
        </p>
      </div>
    </div>
  );
}
