import type { ReactNode } from 'react';

/**
 * Wraps substrings matching `query` in <mark> for search highlighting.
 * Walks indexes instead of building a regex so user input never needs
 * escaping; returns the text untouched for empty/non-matching queries.
 */
export function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLowerCase();
  if (!needle) return text;

  const haystack = text.toLowerCase();
  if (!haystack.includes(needle)) return text;

  const parts: ReactNode[] = [];
  let from = 0;
  let index = haystack.indexOf(needle);
  let key = 0;
  while (index !== -1) {
    if (index > from) parts.push(text.slice(from, index));
    parts.push(<mark key={key++}>{text.slice(index, index + needle.length)}</mark>);
    from = index + needle.length;
    index = haystack.indexOf(needle, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}
