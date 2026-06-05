'use client';

import { useEffect } from 'react';

// global-error.jsx catches errors in the root layout itself (rare but important)
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html>
      <body style={{ background: '#0d0d0d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Critical Error
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            The application encountered a fatal error and could not recover.
          </p>
          <button
            onClick={reset}
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
