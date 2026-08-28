'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { BASE_PATH } from '@/lib/site';

/**
 * Close (X) button for the member profile page — navigates to the
 * members section on the homepage so the user can keep browsing.
 */
export function ProfileCloseButton() {
  const router = useRouter();

  const close = useCallback(() => {
    router.push(`${BASE_PATH}/#team`);
  }, [router]);

  return (
    <button type="button" className="profile-close-btn" aria-label="Close profile" onClick={close}>
      <X aria-hidden="true" />
    </button>
  );
}
