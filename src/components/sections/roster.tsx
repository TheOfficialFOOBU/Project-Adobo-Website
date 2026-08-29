'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MemberRow } from '@/components/member-row';
import {
  CORE_MEMBERS,
  FOUNDERS,
  REGULAR_MEMBERS,
  sortMembers,
  type GuildMember,
  type MemberSortKey,
} from '@/lib/members';
import { cn } from '@/lib/utils';

type RosterFilter = 'all' | 'founders' | 'core' | 'members';

/** Debounce a changing value (original search used a 200ms debounce). */
function useDebouncedValue<T>(value: T, wait = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(timer);
  }, [value, wait]);

  return debounced;
}

const SORT_KEYS = ['name', 'position', 'class', 'weapon'] as const;

/** Initial toolbar state restored from the URL (?q=&filter=&sort=). */
function readRosterParams() {
  const fallback = { q: '', filter: 'all' as RosterFilter, sort: 'name' as MemberSortKey };
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter');
  const sort = params.get('sort');
  return {
    q: params.get('q') ?? '',
    filter:
      filter === 'founders' || filter === 'core' || filter === 'members'
        ? filter
        : ('all' as RosterFilter),
    sort:
      sort && SORT_KEYS.includes(sort as MemberSortKey)
        ? (sort as MemberSortKey)
        : ('name' as MemberSortKey),
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
  const [sortKey, setSortKey] = useState<MemberSortKey>('name');
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
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const founders = useMemo(
    () => sortMembers(filterMembers(FOUNDERS, debouncedQuery), sortKey),
    [debouncedQuery, sortKey]
  );
  const core = useMemo(
    () => sortMembers(filterMembers(CORE_MEMBERS, debouncedQuery), sortKey),
    [debouncedQuery, sortKey]
  );
  const regular = useMemo(
    () => sortMembers(filterMembers(REGULAR_MEMBERS, debouncedQuery), sortKey),
    [debouncedQuery, sortKey]
  );

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
    const search = params.toString();
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    );
  }, [query, filter, sortKey]);

  // "/" focuses the roster search from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }
      event.preventDefault();
      document.getElementById('member-search')?.focus();
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
    <section className="team scroll-of-members" id="team">
      <div className="container">
        <h2 className="section-title">
          Scroll of Members
          <span className="section-number" aria-hidden="true">
            肆
          </span>
        </h2>
        <p className="scroll-of-members-lede">
          Twenty-two wanderers, one guild, zero filters. Read every face.
        </p>

        {/* Filter / sort toolbar */}
        <div className="scroll-toolbar">
          <div className="filter-chips" role="group" aria-label="Jump to roster group">
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

          <div className="member-search-wrap">
            <div className="member-search-field">
              <Search aria-hidden="true" />
              <input
                id="member-search"
                type="search"
                placeholder="Search members, class, or weapon"
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
            </div>
            <button
              type="button"
              className="chip"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              Clear
            </button>
          </div>

          <div className="sorting-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as MemberSortKey)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="position">Position</option>
              <option value="class">Role</option>
              <option value="weapon">Weapon</option>
            </select>
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
              className="scroll-group"
              key={group.key}
              ref={groupRefSetters[group.key as 'founders' | 'core' | 'members']}
            >
              <div className="scroll-divider" aria-hidden="true">
                <span className="scroll-divider-rule scroll-divider-rule--left" />
                <span className="scroll-divider-seal">{group.cn}</span>
                <span className="scroll-divider-rule scroll-divider-rule--right" />
                <span className="scroll-divider-label">{group.label}</span>
              </div>
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
            </div>
          )
        )}
      </div>
    </section>
  );
}
