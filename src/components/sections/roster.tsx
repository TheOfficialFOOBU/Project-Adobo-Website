'use client';

import { LayoutGrid, Rows3 } from 'lucide-react';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MemberGridCard } from '@/components/member-grid-card';
import { MemberRow } from '@/components/member-row';
import {
  CORE_MEMBERS,
  FOUNDERS,
  GUILD_MEMBERS,
  REGULAR_MEMBERS,
  sortMembers,
  type GuildMember,
} from '@/lib/members';
import { cn } from '@/lib/utils';

type RosterFilter = 'all' | 'founders' | 'core' | 'members';
type RosterView = 'row' | 'grid';

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
  'Twenty',
  'Twenty-one',
  'Twenty-two',
  'Twenty-three',
  'Twenty-four',
  'Twenty-five',
  'Twenty-six',
  'Twenty-seven',
  'Twenty-eight',
  'Twenty-nine',
  'Thirty',
  'Thirty-one',
  'Thirty-two',
];

/** Spell out the active roster count in the lede so it can never go stale. */
const ROSTER_COUNT_PHRASE = NUMBER_WORDS[GUILD_MEMBERS.length] ?? `${GUILD_MEMBERS.length}`;

/** Debounce a changing value (original search used a 200ms debounce). */
function useDebouncedValue<T>(value: T, wait = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(timer);
  }, [value, wait]);

  return debounced;
}

/**
 * Valid sort keys exposed in the toolbar dropdown. The `weapon` key still
 * exists in the `MemberSortKey` type so the underlying `sortMembers`
 * function handles it as a defensive fallback, but it isn't surfaced in
 * the UI per the active taxonomy (Name, Position, Class).
 */
const SORT_KEYS = ['name', 'position', 'class'] as const;
type ExposedSortKey = (typeof SORT_KEYS)[number];

/** Initial toolbar state restored from the URL (?q=&filter=&sort=&view=). */
function readRosterParams() {
  const fallback = {
    q: '',
    filter: 'all' as RosterFilter,
    sort: 'name' as ExposedSortKey,
    view: 'row' as RosterView,
    dir: 'asc' as 'asc' | 'desc',
  };
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter');
  const sort = params.get('sort');
  const dir = params.get('dir');
  const view = params.get('view');
  return {
    q: params.get('q') ?? '',
    filter:
      filter === 'founders' || filter === 'core' || filter === 'members'
        ? filter
        : ('all' as RosterFilter),
    sort:
      sort && (SORT_KEYS as readonly string[]).includes(sort)
        ? (sort as ExposedSortKey)
        : ('name' as ExposedSortKey),
    view: view === 'grid' ? ('grid' as RosterView) : ('row' as RosterView),
    dir: dir === 'desc' ? 'desc' : 'asc',
  };
}

function filterMembers(members: GuildMember[], query: string): GuildMember[] {
  const q = query.trim().toLowerCase();
  if (!q) return members;
  return members.filter((m) =>
    [m.name, m.class, m.position, m.weapon].join(' ').toLowerCase().includes(q)
  );
}

const FILTERS: { key: RosterFilter; label: string; cnChar: string }[] = [
  { key: 'all', label: 'All', cnChar: '眾' },
  { key: 'founders', label: 'Founders', cnChar: '始' },
  { key: 'core', label: 'Core', cnChar: '骨' },
  { key: 'members', label: 'Members', cnChar: '門' },
];

/**
 * "Scroll of Members" — the roster section renders as a single vertical
 * scroll (alternating rows for visual rhythm) divided by centered
 * cinnabar brushstroke dividers per group. No pagination, no tabs,
 * no 3D flip. Every member's quote is always visible.
 */
export function RosterSection() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RosterFilter>('all');
  const [sortKey, setSortKey] = useState<ExposedSortKey>('name');
  const [nameSortDir, setNameSortDir] = useState<'asc' | 'desc'>('asc');
  const [view, setView] = useState<RosterView>('row');
  const debouncedQuery = useDebouncedValue(query, 200);

  // Refs as DOM element handles — populated when each group mounts. The
  // refs themselves are stable; only `current` is read at click time.
  const foundersElRef = useRef<HTMLDivElement | null>(null);
  const coreElRef = useRef<HTMLDivElement | null>(null);
  const membersElRef = useRef<HTMLDivElement | null>(null);

  const setFoundersRef = useCallback((node: HTMLDivElement | null) => {
    foundersElRef.current = node;
  }, []);
  const setCoreRef = useCallback((node: HTMLDivElement | null) => {
    coreElRef.current = node;
  }, []);
  const setMembersRef = useCallback((node: HTMLDivElement | null) => {
    membersElRef.current = node;
  }, []);

  useEffect(() => {
    const restored = readRosterParams();
    /* eslint-disable react-hooks/set-state-in-effect -- one-shot restore from the URL, an external system */
    if (restored.q) setQuery(restored.q);
    if (restored.filter !== 'all') setFilter(restored.filter);
    if (restored.sort !== 'name') setSortKey(restored.sort);
    if (restored.view !== 'row') setView(restored.view);
    setNameSortDir(restored.dir as 'asc' | 'desc');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const founders = useMemo(() => {
    const sorted = sortMembers(filterMembers(FOUNDERS, debouncedQuery), sortKey);
    return nameSortDir === 'desc' && sortKey === 'name' ? sorted.reverse() : sorted;
  }, [debouncedQuery, sortKey, nameSortDir]);
  const core = useMemo(() => {
    const sorted = sortMembers(filterMembers(CORE_MEMBERS, debouncedQuery), sortKey);
    return nameSortDir === 'desc' && sortKey === 'name' ? sorted.reverse() : sorted;
  }, [debouncedQuery, sortKey, nameSortDir]);
  const regular = useMemo(() => {
    const sorted = sortMembers(filterMembers(REGULAR_MEMBERS, debouncedQuery), sortKey);
    return nameSortDir === 'desc' && sortKey === 'name' ? sorted.reverse() : sorted;
  }, [debouncedQuery, sortKey, nameSortDir]);

  const groups: { key: RosterFilter; label: string; cn: string; list: GuildMember[] }[] = [
    { key: 'founders', label: 'Founders', cn: '始', list: founders },
    { key: 'core', label: 'Core Members', cn: '骨', list: core },
    { key: 'members', label: 'Members', cn: '門', list: regular },
  ];

  const groupRefs: Record<RosterFilter, React.MutableRefObject<HTMLDivElement | null>> = {
    founders: foundersElRef,
    core: coreElRef,
    members: membersElRef,
    all: foundersElRef,
  };

  const groupRefSetters: Record<
    'founders' | 'core' | 'members',
    (node: HTMLDivElement | null) => void
  > = {
    founders: setFoundersRef,
    core: setCoreRef,
    members: setMembersRef,
  };

  // Mirror toolbar state into the URL so filtered views are shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (filter !== 'all') params.set('filter', filter);
    if (sortKey !== 'name') params.set('sort', sortKey);
    if (nameSortDir === 'desc' && sortKey === 'name') params.set('dir', 'desc');
    if (view !== 'row') params.set('view', view);
    const search = params.toString();
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    );
  }, [query, filter, sortKey, nameSortDir, view]);

  // "/" focuses the roster search from anywhere on the page.
  // "g g" (double-tap, under 600ms) scrolls to the roster from anywhere
  // on the page. Browser devtools use single "g" to scroll, so we
  // require two presses in quick succession and explicitly skip when
  // the user is typing.
  useEffect(() => {
    let lastG = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const typing =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable;
      if (typing) {
        lastG = 0;
        return;
      }
      // Avoid stomping on browser/extension shortcuts — only intercept
      // bare keys (no modifiers).
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === '/') {
        event.preventDefault();
        document.getElementById('member-search')?.focus();
        return;
      }
      if (event.key.toLowerCase() === 'g') {
        const now = Date.now();
        if (now - lastG < 600) {
          event.preventDefault();
          lastG = 0;
          const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          const el = document.getElementById('team');
          el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          // Move keyboard focus to the search input for immediate typing.
          document.getElementById('member-search')?.focus({ preventScroll: true });
        } else {
          lastG = now;
        }
      } else {
        // Any other key resets the "gg" chain so the user has to press
        // both g's cleanly.
        lastG = 0;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const jumpTo = (key: RosterFilter) => {
    setFilter(key);
    const target = groupRefs[key]?.current ?? foundersElRef.current;
    if (!target) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const visibleGroups = filter === 'all' ? groups : groups.filter((g) => g.key === filter);
  const totalVisible = founders.length + core.length + regular.length;

  return (
    <section className="team scroll-of-members" id="team" data-animate>
      {/* Corner ticks on the gold inner frame — top-left and bottom-right,
          matching the dossier / contact-modal bracket language. Decorative. */}
      <span className="scroll-of-members-tick scroll-of-members-tick--tl" aria-hidden="true" />
      <span className="scroll-of-members-tick scroll-of-members-tick--br" aria-hidden="true" />

      <div className="container">
        <h2 className="section-title">
          Members
          <span className="section-number seal-press" aria-hidden="true">
            肆
          </span>
        </h2>
        <p className="scroll-of-members-lede">
          {ROSTER_COUNT_PHRASE} wanderers, one guild, zero filters. Read every face.
        </p>

        {/* Result count — dynamically reflects filtered/search state. */}
        <p className="result-count">
          {totalVisible} of {GUILD_MEMBERS.length} wanderers
        </p>

        {/* Filter chips — group navigation, sits on its own line inside the
              toolbar so it reads as a separate concern from the per-card
              search/sort/view controls below. */}
        <div className="scroll-toolbar-chips" role="group" aria-label="Jump to roster group">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={cn('chip', filter === f.key && 'chip-active')}
              aria-pressed={filter === f.key}
              onClick={() => jumpTo(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + Sort + View utility row — the primary dossier toolbar.
            Search is the dominant control (full flex), then Sort and the
            segmented Row/Grid toggle share the remainder with matching
            height, border treatment, and corner radius. */}
        <div className="scroll-toolbar-row">
          <div className="member-search-wrap">
            <Search className="member-search-icon" aria-hidden="true" />
            <input
              id="member-search"
              type="search"
              placeholder="Search Members, Class, Position"
              aria-label="Search members"
              className="member-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setQuery('');
                  event.currentTarget.blur();
                }
              }}
            />
            {query ? (
              <button
                type="button"
                className="member-search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>

          <label className="toolbar-field toolbar-field--sort">
            <span className="toolbar-field-label">Sort by</span>
            <select
              id="sort-select"
              className="toolbar-select"
              value={sortKey}
              onChange={(event) => {
                const newSort = event.target.value as ExposedSortKey;
                if (newSort === 'name') {
                  setNameSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                } else {
                  // keep nameSortDir unchanged when switching sort key
                }
                setSortKey(newSort);
              }}
            >
              <option value="name">Name</option>
              <option value="position">Position</option>
              <option value="class">Role</option>
            </select>
          </label>

          <div className="toolbar-field toolbar-field--view" role="group" aria-label="Roster view">
            <span className="toolbar-field-label">View</span>
            <div className="view-toggle">
              <button
                type="button"
                className={cn('view-toggle-btn', view === 'row' && 'view-toggle-btn--active')}
                aria-pressed={view === 'row'}
                onClick={() => setView('row')}
              >
                <Rows3 aria-hidden="true" />
                <span>Row</span>
              </button>
              <button
                type="button"
                className={cn('view-toggle-btn', view === 'grid' && 'view-toggle-btn--active')}
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
              >
                <LayoutGrid aria-hidden="true" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {totalVisible === 0 ? (
          <div className="members-empty" role="status">
            <Search aria-hidden="true" />
            <p>No members match your search.</p>
            <button
              type="button"
              className="chip"
              onClick={() => {
                setQuery('');
              }}
            >
              Reset search
            </button>
          </div>
        ) : null}

        {visibleGroups.map((group) =>
          group.list.length === 0 ? null : (
            <div
              className={cn('scroll-group', view === 'grid' && 'scroll-group--grid')}
              key={group.key}
              ref={groupRefSetters[group.key as 'founders' | 'core' | 'members']}
            >
              <div className="scroll-divider" aria-hidden="true">
                <span className="scroll-divider-rule scroll-divider-rule--left" />
                <span className="scroll-divider-seal">{group.cn}</span>
                <span className="scroll-divider-rule scroll-divider-rule--right" />
                <span className="scroll-divider-label">{group.label}</span>
              </div>
              {view === 'row' ? (
                <div className="scroll-rows">
                  {group.list.map((member, index) => (
                    <MemberRow
                      key={member.name}
                      member={member}
                      highlight={debouncedQuery}
                      reverse={index % 2 === 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="scroll-grid">
                  {group.list.map((member) => (
                    <MemberGridCard key={member.name} member={member} highlight={debouncedQuery} />
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
