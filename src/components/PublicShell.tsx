// Header + footer wrapper used by every public page.

import Link from 'next/link';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="Rithala Update home">
            <img src="/logo.png" alt="Rithala Update Logo" width={44} height={44} />
            <span className="brand-text">Rithala Update</span>
          </Link>
          <div className="social-icons">
            <a href="https://www.instagram.com/rithala_update/" target="_blank" rel="noopener" title="Instagram">IG</a>
            <a href="https://www.youtube.com/@rithala_update" target="_blank" rel="noopener" title="YouTube">YT</a>
            <a href="https://www.facebook.com/profile.php?id=61581104611697" target="_blank" rel="noopener" title="Facebook">FB</a>
            <a href="https://in.pinterest.com/rithala_update/" target="_blank" rel="noopener" title="Pinterest">PN</a>
            <a href="mailto:rithalyarajput@gmail.com" title="Email">@</a>
          </div>
        </div>
      </header>
      <nav className="nav-wrap" aria-label="Main">
        <div className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/about/">About</Link>
          <Link href="/category/history/">History</Link>
          <Link href="/category/events/">Events</Link>
          <Link href="/category/places/">Places</Link>
          <Link href="/category/brotherhood/">Brotherhood</Link>
          <Link href="/category/kawad-yatra-2025/">Kawad 2025</Link>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <img src="/logo.png" alt="Rithala Update" width={100} style={{ borderRadius: '50%' }} />
              <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
                <Link href="/">Home</Link> · <Link href="/about/">About</Link>
              </p>
            </div>
            <div>
              <h3>🚩 Jai Rajputana!</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Thank you for visiting <strong>Rithala Update</strong>. Share your photos
                and stories at <a href="mailto:rithalyarajput@gmail.com">rithalyarajput@gmail.com</a>.
              </p>
            </div>
            <div>
              <h3>Connect</h3>
              <p>
                <a href="https://www.instagram.com/rithala_update/" target="_blank" rel="noopener">Instagram</a><br />
                <a href="https://www.youtube.com/@rithala_update" target="_blank" rel="noopener">YouTube</a><br />
                <a href="https://www.facebook.com/profile.php?id=61581104611697" target="_blank" rel="noopener">Facebook</a><br />
                <a href="https://in.pinterest.com/rithala_update/" target="_blank" rel="noopener">Pinterest</a>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 Rithala Update. All Rights Reserved. Designed by{' '}
            <Link href="/about/">Sandeep Rajput</Link>.
          </div>
        </div>
      </footer>
    </>
  );
}
