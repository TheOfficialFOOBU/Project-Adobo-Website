import { useMemo } from 'react';

/**
 * Per-member personal seal — a deterministic cinnabar chop generated from the
 * member's name. Inspired by traditional personal chops that pair a motif
 * with the bearer's mark. Each member gets:
 *
 *   • A motif chosen from a small vocabulary (waves, blade, brushstroke,
 *     leaf, sun, mountain) via a hash of the name
 *   • A 1–2 character abbreviation chosen from the CJK/ASCII glyphs in the
 *     name (or a fallback symbol)
 *   • A subtle rotation derived from the same hash so neighbouring cards
 *     don't all sit perfectly upright
 *
 * The chop is deterministic: a given name always renders identically,
 * never randomises between builds. It is rendered as inline SVG (no
 * network request) and uses only the existing palette.
 */

type Motif = 'waves' | 'blade' | 'brush' | 'leaf' | 'sun' | 'mountain';

const MOTIFS: Motif[] = ['waves', 'blade', 'brush', 'leaf', 'sun', 'mountain'];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickMotif(seed: number): Motif {
  return MOTIFS[seed % MOTIFS.length];
}

function pickRotation(seed: number): number {
  // Between -4 and 4 degrees — subtle, not sloppy.
  const span = 8;
  const offset = seed % (span * 2 + 1);
  return offset - span;
}

function pickGlyph(name: string): string {
  // Pull the first non-ASCII or digit character we can find — this lets
  // multi-script names (Wuxia members with CJK, Latin, Filipino) keep
  // their original character. Falls back to a single Latin initial.
  for (const ch of name) {
    if (/[^\u0000-\u00F7]/.test(ch)) return ch;
  }
  const cleaned = name.replace(/[^A-Za-z0-9]/g, '');
  return cleaned.charAt(0).toUpperCase() || '·';
}

interface MemberPersonalSealProps {
  name: string;
  /** Optional override label (e.g., a glyph or initials) — useful for tests. */
  glyph?: string;
  size?: number;
  /** Decorative-only — kept out of the accessibility tree. */
  ariaHidden?: boolean;
}

export function MemberPersonalSeal({
  name,
  glyph,
  size = 56,
  ariaHidden = true,
}: MemberPersonalSealProps) {
  const seed = useMemo(() => hash(name), [name]);
  const motif = pickMotif(seed);
  const rotation = pickRotation(seed >>> 4);
  const displayGlyph = glyph ?? pickGlyph(name);

  return (
    <svg
      className="member-personal-seal"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden={ariaHidden}
      focusable="false"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <title>{`Personal seal of ${name}`}</title>
      {/* Outer chop frame — matches the existing cinnabar seal vocabulary */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="6"
        ry="6"
        fill="rgb(var(--crimson-rgb) / 0.06)"
        stroke="rgb(var(--crimson-rgb) / 0.85)"
        strokeWidth="2"
      />
      {/* Inner accent rule */}
      <rect
        x="7"
        y="7"
        width="50"
        height="50"
        rx="4"
        ry="4"
        fill="none"
        stroke="rgb(var(--crimson-rgb) / 0.3)"
        strokeWidth="1"
      />
      {/* Motif layer */}
      <g
        fill="none"
        stroke="rgb(var(--crimson-rgb) / 0.75)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {motif === 'waves' ? <MotifWaves /> : null}
        {motif === 'blade' ? <MotifBlade /> : null}
        {motif === 'brush' ? <MotifBrush /> : null}
        {motif === 'leaf' ? <MotifLeaf /> : null}
        {motif === 'sun' ? <MotifSun /> : null}
        {motif === 'mountain' ? <MotifMountain /> : null}
      </g>
      {/* Glyph — the bearer's mark */}
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize="20"
        fill="rgb(var(--crimson-rgb) / 0.95)"
      >
        {displayGlyph}
      </text>
    </svg>
  );
}

function MotifWaves() {
  return (
    <g aria-hidden="true">
      <path d="M10 18 Q16 14 22 18 T34 18" />
      <path d="M10 24 Q16 20 22 24 T34 24" />
      <path d="M10 50 Q16 46 22 50 T34 50" opacity="0.55" />
    </g>
  );
}

function MotifBlade() {
  return (
    <g aria-hidden="true">
      <path d="M14 14 L50 50" />
      <path d="M50 14 L14 50" />
      <circle cx="32" cy="32" r="3.5" fill="rgb(var(--crimson-rgb) / 0.18)" />
    </g>
  );
}

function MotifBrush() {
  return (
    <g aria-hidden="true">
      <path d="M12 32 Q24 26 36 32 T52 32" strokeWidth="2.4" />
      <path d="M16 38 L48 38" opacity="0.45" />
    </g>
  );
}

function MotifLeaf() {
  return (
    <g aria-hidden="true">
      <path d="M20 22 Q32 16 44 22 Q44 38 32 42 Q20 38 20 22 Z" />
      <path d="M32 18 L32 42" opacity="0.55" />
    </g>
  );
}

function MotifSun() {
  return (
    <g aria-hidden="true">
      <circle cx="32" cy="20" r="6" />
      <path d="M32 12 L32 8 M32 32 L32 36 M22 20 L18 20 M42 20 L46 20 M25 13 L22 10 M39 13 L42 10 M25 27 L22 30 M39 27 L42 30" />
    </g>
  );
}

function MotifMountain() {
  return (
    <g aria-hidden="true">
      <path d="M10 44 L24 22 L34 32 L42 20 L54 44 Z" />
      <path d="M24 22 L28 18" opacity="0.7" />
    </g>
  );
}
