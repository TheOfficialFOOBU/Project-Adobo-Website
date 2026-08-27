'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="hero-2 nf-hero">
      <div className="hero-2-content centered">
        <span className="seal-stamp" aria-hidden="true">
          錯
        </span>
        <h1>Something went wrong</h1>
        <p>An unexpected error occurred. Please try again.</p>
        <button type="button" className="cta-button" onClick={() => reset()}>
          Try Again
        </button>
      </div>
    </main>
  );
}
