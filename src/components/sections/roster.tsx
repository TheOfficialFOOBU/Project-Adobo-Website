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

function MembersPanel() {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [sortKey, setSortKey] = useState<MemberSortKey>('name');
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebouncedValue(query, 200);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const matching = REGULAR_MEMBERS.filter((m) => {
      if (!matchesRole(m, roleFilter)) return false;
      if (!q) return true;
      return [m.name, m.class, m.position, m.weapon].join(' ').toLowerCase().includes(q);
    });
    return sortMembers(matching, sortKey);
  }, [debouncedQuery, sortKey, roleFilter]);

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

  return (
    <>
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

      {/* Members-tab sort bar (surfaced in v2 — the logic was always wired). */}
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

      {filtered.length > 0 ? (
        <p className="members-count" role="status">
          Showing {rangeStart}–{rangeEnd} of {filtered.length} members
        </p>
      ) : null}

      {pageSlice.length === 0 ? (
        <div className="members-empty" role="status">
          <Search aria-hidden="true" />
          <p>No members match your search or filters.</p>
          <button type="button" className="chip" onClick={resetFilters}>
            Reset search &amp; filters
          </button>
        </div>
      ) : (
        <div className="members-grid-container" id="members-list" ref={gridRef}>
          {pageSlice.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="members-pagination" id="members-pagination">
          <button
            type="button"
            className="cta-button small"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>
          <div className="members-pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            type="button"
            className="cta-button small"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}

function memberGrid(members: GuildMember[]) {
  return (
    <div className="team-grid">
      {members.map((member) => (
        <MemberCard key={member.name} member={member} />
      ))}
    </div>
  );
}

/**
 * “Guild Roster” — founders / core / members tabs rendered with Radix Tabs
 * (shadcn/ui) styled with the original Adobo classes. Panels use
 * forceMount so every grid stays registered (matching the original DOM)
 * while inactive panels are hidden by the ported CSS.
 */
export function RosterSection() {
  return (
    <section className="team" id="team" data-animate>
      <div className="container">
        <h2 className="section-title">
          Guild Roster
          <span className="section-number" aria-hidden="true">
            肆
          </span>
        </h2>

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

          <TabsContent value="founders-tab" className="tab-panel" forceMount>
            {memberGrid(FOUNDERS)}
          </TabsContent>

          <TabsContent value="core-tab" className="tab-panel" id="core-tab" forceMount>
            {memberGrid(CORE_MEMBERS)}
          </TabsContent>

          <TabsContent value="members-tab" className="tab-panel" id="members-tab" forceMount>
            <MembersPanel />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
