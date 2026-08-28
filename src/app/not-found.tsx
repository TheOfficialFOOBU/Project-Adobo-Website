import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found — Adobo Guild',
  description: 'The page you are looking for does not exist.',
};

/**
 * 404 page — reuses the existing Adobo section styles so it matches the
 * site identity without introducing any new design language.
 * Header/footer come from the root layout.
 */
export default function NotFound() {
  return (
    <main id="main">
      <section className="hero-2 nf-hero">
        <div className="hero-2-content centered">
          <span className="seal-stamp" aria-hidden="true">
            無
          </span>
          <h1>404</h1>
          <p>The page you are looking for does not exist.</p>
          <Link href="/" className="cta-button">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
