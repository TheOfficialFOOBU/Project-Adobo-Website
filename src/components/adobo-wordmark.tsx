interface AdoboWordmarkProps {
  /** Visual scale; the mark uses an inline 40×40 viewBox so any pixel size works. */
  size?: number;
  /** When true, render just the ADOBO + ᜊ signature without the leaf or rules. */
  compact?: boolean;
  /** Visual variant — `cinnabar` (default) or `muted` for watermarks. */
  variant?: 'cinnabar' | 'muted' | 'accent';
  /** Hide from screen readers when used purely decoratively. */
  ariaHidden?: boolean;
  /** Aria-label override; defaults to a short site signature. */
  label?: string;
}

/**
 * The site's recurring visual signature — leaf (Filipino) + ADOBO + Baybayin
 * ᜊ (Ba). Extracted from the footer seal so it can be reused as a
 * watermark, section transition, or small page mark without redefining
 * the geometry every time. The mark stays decorative: when `ariaHidden`
 * is true (default) the SVG is hidden from assistive tech.
 *
 * Intentionally kept lean — no JS, no state, single inline SVG group.
 */
export function AdoboWordmark({
  size = 36,
  compact = false,
  variant = 'cinnabar',
  ariaHidden = true,
  label = 'Adobo — Baybayin Ba signature',
}: AdoboWordmarkProps) {
  const colorClass = `adobo-wordmark--${variant}`;
  return (
    <span
      className={`adobo-wordmark ${colorClass} ${compact ? 'adobo-wordmark--compact' : ''}`}
      aria-hidden={ariaHidden}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : label}
    >
      {!compact ? (
        <svg
          className="adobo-wordmark-leaf"
          viewBox="0 0 40 40"
          width={size}
          height={size}
          focusable="false"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M 21 37 C 18 36, 14 33, 12 27 C 10 21, 11 14, 16 9 C 20 5, 25 5, 26 7 C 27 11, 27 18, 25 24 C 23 30, 21 35, 21 37 Z"
              transform="rotate(-3 20 20)"
            />
            <path d="M 21 37 L 21 38.5" strokeWidth="1.25" />
            <path
              d="M 21 36 C 20 28, 19 19, 21 11"
              strokeWidth="0.75"
              strokeOpacity="0.55"
              transform="rotate(-3 20 20)"
            />
          </g>
        </svg>
      ) : null}
      <span className="adobo-wordmark-rule" aria-hidden="true" />
      <span className="adobo-wordmark-text">ADOBO</span>
      <span className="adobo-wordmark-rule" aria-hidden="true" />
      <svg
        className="adobo-wordmark-ba"
        viewBox="0 0 40 40"
        width={size}
        height={size}
        focusable="false"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 13 13 C 13 10, 17 9, 21 11 C 25 13, 24 19, 20 23 C 16 27, 14 29, 14 32" />
          <circle cx="11" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <line x1="27" y1="12" x2="30" y2="9" />
          <line x1="30" y1="12" x2="27" y2="9" />
        </g>
      </svg>
    </span>
  );
}
