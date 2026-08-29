'use client';

import { X } from 'lucide-react';

import { BASE_PATH } from '@/lib/site';

/**
 * Close (X) button for the member profile page — navigates back to
 * the homepage anchored to the members roster so the user can keep
 * browsing.
 *
 * Renders as a plain anchor rather than a router.push() call: in the
 * static export, router.push('/#team') from a /members/[slug] route
 * can be mis-parsed as a route match and bounce to the 404 page. A
 * regular anchor navigation is reliable across all deployment modes.
 */
export function ProfileCloseButton() {
  return (
    <a
      href={`${BASE_PATH}/#team`}
      className="profile-close-btn"
      aria-label="Close profile and return to members"
    >
      <X aria-hidden="true" />
    </a>
  );
}
