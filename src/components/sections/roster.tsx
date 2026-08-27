'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MemberCard } from '@/components/member-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CORE_MEMBERS,
  FOUNDERS,
  REGULAR_MEMBERS,
  sortMembers,
  type GuildMember,
  type MemberSortKey,
} from '@/lib/members';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

/** Role chips — matched against the class field's leading role keywords. */
const ROLE_FILTERS = ['All', 'DPS', 'Tank', 'Healer'] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];

function matchesRole(member: GuildMember, role: RoleFilter): boolean {
  if (role === 'All') return true;
  return member.class.toLowerCase().includes(role.toLowerCase());
}

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

/** Initial toolbar state restored from the URL (?q=&role=&sort=&page=). */
function readRosterParams() {
  const fallback = { q: '', role: 'All' as RoleFilter, sort: 'name' as MemberSortKey, page: 1 };
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role') as RoleFilter | null;
  const sortParam = params.get('sort') as MemberSortKey | null;
  return {
    q: params.get('q') ?? '',
    role: roleParam && ROLE_FILTERS.includes(roleParam) ? roleParam : ('All' as RoleFilter),
    sort: sortParam && SORT_KEYS.includes(sortParam) ? sortParam : ('name' as MemberSortKey),
    page: Math.max(1, Number(params.get('page')) || 1),
  };
}

/** Shared search/sort/role filtering applied to every roster tab. */
function filterMembers(members: GuildMember[], query: string, role: RoleFilter): GuildMember[] {
  const q = query.trim().toLowerCase();
  return members.filter((m) => {
    if (!matchesRole(m, role)) return false;
    if (!q) return true;
    return [m.name, m.class, m.position, m.weapon].join(' ').toLowerCase().includes(q);
  });
}

/** Windowed page list: 1 … c-1 c c+1 … total (all pages when ≤7). */
function buildPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('ellipsis');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

function EmptyRoster({ onReset }: { onReset: () => void }) {
  return (
    <div className="members-empty" role="status">
      <Search aria-hidden="true" />
      <p>No members match your search or filters.</p>
      <button type="button" className="chip" onClick={onReset}>
        Reset search &amp; filters
      </button>
    </div>
  );
}

/**
 * "Guild Roster" — founders / core / members tabs rendered with Radix Tabs
 * (shadcn/ui) styled with the original Adobo classes. Only the active panel
 * is mounted; inactive tabs are unmounted to reduce initial rendering cost.
 *
 * The search/sort/role toolbar sits above the tabs and filters every
 * roster group; pagination applies to the paginated Members tab.
 */
export function RosterSection() {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [sortKey, setSortKey] = useState<MemberSortKey>('name');
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebouncedValue(query, 200);

  // Restore shareable URL state post-hydration — reading it during first
  // render desyncs SSR markup (React #418) and drops <html data-theme>.
  useEffect(() => {
    const restored = readRosterParams();
    /* eslint-disable react-hooks/set-state-in-effect -- one-shot restore from the URL, an external system */
    if (restored.q) setQuery(restored.q);
    if (restored.role !== 'All') setRoleFilter(restored.role);
    if (restored.sort !== 'name') setSortKey(restored.sort);
    if (restored.page > 1) setPage(restored.page);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const filteredFounders = useMemo(
    () => sortMembers(filterMembers(FOUNDERS, debouncedQuery, roleFilter), sortKey),
    [debouncedQuery, roleFilter, sortKey]
  );
  const filteredCore = useMemo(
    () => sortMembers(filterMembers(CORE_MEMBERS, debouncedQuery, roleFilter), sortKey),
    [debouncedQuery, roleFilter, sortKey]
  );
  const filtered = useMemo(
    () => sortMembers(filterMembers(REGULAR_MEMBERS, debouncedQuery, roleFilter), sortKey),
    [debouncedQuery, roleFilter, sortKey]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const pageSlice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /** Page change + bring the grid back into view (skipped for filter edits). */
  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), Math.max(totalPages, 1));
    if (clamped === currentPage) return;
    setPage(clamped);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  };

  const resetFilters = () => {
    setQuery('');
    setRoleFilter('All');
    setPage(1);
  };

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  /* Mirror toolbar state into the URL so filtered views are shareable. */
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (roleFilter !== 'All') params.set('role', roleFilter);
    if (sortKey !== 'name') params.set('sort', sortKey);
    if (currentPage > 1) params.set('page', String(currentPage));
    const search = params.toString();
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    );
  }, [query, roleFilter, sortKey, currentPage]);

  /* "/" focuses the roster search when the roster section is visible.
     Scoped to avoid hijacking the browser find shortcut. */
  useEffect(() => {
    const rosterSection = document.getElementById('team');
    if (!rosterSection) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }
      const rect = rosterSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      event.preventDefault();
      document.getElementById('member-search')?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const memberGrid = (members: GuildMember[]) => (
    <div className="team-grid">
      {members.map((member) => (
        <MemberCard key={member.name} member={member} highlight={debouncedQuery} />
      ))}
    </div>
  );

  return (
    <section className="team" id="team" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Roster
          <span className="section-number" aria-hidden="true">
            肆
          </span>
        </h2>

        {/* Shared toolbar — search, roles, and sorting apply to every tab. */}
        <div className="filter-chips" role="group" aria-label="Filter members by combat role">
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              type="button"
              className={cn('chip', roleFilter === role && 'chip-active')}
              aria-pressed={roleFilter === role}
              onClick={() => {
                setRoleFilter(role);
                setPage(1);
              }}
            >
              {role}
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
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setQuery('');
                  setPage(1);
                  event.currentTarget.blur();
                }
              }}
            />
          </div>
          <button
            type="button"
            id="clear-search"
            className="chip"
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
          >
            Clear
          </button>
        </div>

        <div className="sorting-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(event) => {
              setSortKey(event.target.value as MemberSortKey);
              setPage(1);
            }}
          >
            <option value="name">Name (A-Z)</option>
            <option value="position">Position</option>
            <option value="class">Role</option>
            <option value="weapon">Weapon</option>
          </select>
        </div>

        <Tabs defaultValue="founders-tab">
          <TabsList className="member-tabs" aria-label="Guild roster tabs">
            <TabsTrigger value="founders-tab" className="tab-btn">
              Founders
            </TabsTrigger>
            <TabsTrigger value="core-tab" className="tab-btn">
              Core Members
            </TabsTrigger>
            <TabsTrigger value="members-tab" className="tab-btn">
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="founders-tab" className="tab-panel">
            {filteredFounders.length > 0 ? (
              memberGrid(filteredFounders)
            ) : (
              <EmptyRoster onReset={resetFilters} />
            )}
          </TabsContent>

          <TabsContent value="core-tab" className="tab-panel" id="core-tab">
            {filteredCore.length > 0 ? (
              memberGrid(filteredCore)
            ) : (
              <EmptyRoster onReset={resetFilters} />
            )}
          </TabsContent>

          <TabsContent value="members-tab" className="tab-panel" id="members-tab">
            {filtered.length > 0 ? (
              <p className="members-count" role="status">
                Showing {rangeStart}&ndash;{rangeEnd} of {filtered.length} members
              </p>
            ) : null}

            {pageSlice.length === 0 ? (
              <EmptyRoster onReset={resetFilters} />
            ) : (
              <div className="members-grid-container" id="members-list" ref={gridRef}>
                {pageSlice.map((member) => (
                  <MemberCard key={member.name} member={member} highlight={debouncedQuery} />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <nav className="members-pagination" id="members-pagination" aria-label="Roster pages">
                <button
                  type="button"
                  className="cta-button small"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Prev
                </button>
                {buildPageItems(currentPage, totalPages).map((item, index) =>
                  item === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="members-pagination-ellipsis"
                      aria-hidden="true"
                    >
                      &hellip;
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className="page-btn"
                      aria-current={item === currentPage ? 'page' : undefined}
                      aria-label={`Go to page ${item}`}
                      onClick={() => goToPage(item)}
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  type="button"
                  className="cta-button small"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </nav>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
