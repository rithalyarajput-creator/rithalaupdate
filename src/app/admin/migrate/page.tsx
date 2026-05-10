import MigrateForm from './MigrateForm';

export const metadata = {
  title: 'Migrate — Rithala Admin',
  robots: { index: false, follow: false },
};

export default function MigratePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1 style={{ color: '#c11' }}>🔒 Disabled</h1>
          <p>ADMIN_SETUP_TOKEN not configured.</p>
        </div>
      </div>
    );
  }
  if (searchParams.token !== expected) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1 style={{ color: '#c11' }}>🔒 Forbidden</h1>
          <p>Invalid token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-box" style={{ maxWidth: 600 }}>
        <h1>🔧 Database Migration</h1>
        <p style={{ color: '#666' }}>
          Run this once to upgrade the database schema with new tables (leads, reels)
          and new columns (SEO fields, media alt text, settings). Safe to run multiple times.
        </p>
        <MigrateForm token={searchParams.token!} />
      </div>
    </div>
  );
}
