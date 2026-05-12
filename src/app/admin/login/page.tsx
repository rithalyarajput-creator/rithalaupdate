import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login  Rithala Admin',
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <div className="login-page">
      <div className="login-box">
        <h1> Rithala Admin</h1>
        <p style={{ textAlign: 'center', color: '#666', marginTop: -8 }}>
          Sign in to manage your site
        </p>
        <LoginForm next={searchParams.next} error={searchParams.error} />
      </div>
    </div>
  );
}
