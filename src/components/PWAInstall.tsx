'use client';

import { useEffect, useState } from 'react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if user hasn't dismissed in last 7 days
      const dismissed = localStorage.getItem('pwa_dismissed');
      if (!dismissed || Date.now() - Number(dismissed) > 7 * 24 * 60 * 60 * 1000) {
        setShow(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  }

  function dismiss() {
    localStorage.setItem('pwa_dismissed', String(Date.now()));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-content">
        <img src="/logo.png" alt="Rithala Update" width={48} height={48} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}> Install Rithala Update</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            App ki tarah phone/desktop pe install karein  fast & offline support
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleInstall} className="btn btn-sm">Install</button>
          <button onClick={dismiss} className="btn btn-sm btn-secondary">×</button>
        </div>
      </div>
    </div>
  );
}
