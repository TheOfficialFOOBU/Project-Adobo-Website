'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Close (X) button for the member profile page — returns to the previous
 * page if history has entries, otherwise falls back to the homepage.
 */
export function ProfileCloseButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="profile-close-btn"
      aria-label="Close profile"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      }}
    >
      <X aria-hidden="true" />
    </button>
  );
}
