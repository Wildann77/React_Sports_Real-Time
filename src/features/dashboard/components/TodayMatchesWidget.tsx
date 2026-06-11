import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MatchStatus } from '@/shared/types/models';
import { MatchSortOption } from '@/features/matches/types';
import { useMatches } from '@/features/matches/hooks';
import {
  MatchListItem,
  MatchSearchBar,
  MatchAdvancedFilters,
  MatchPagination,
} from '@/features/matches/components';
import { Button } from '@/shared/ui/button';
import { MessageSquarePlus, ExternalLink, Settings, RefreshCw } from 'lucide-react';
import { Select } from '@/shared/ui/native-select';

export function TodayMatchesWidget() {
  const [status, setStatus] = useState<MatchStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [sort, setSort] = useState<MatchSortOption>('date_desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useMatches({
    status,
    team: search || undefined,
    sport: sport || undefined,
    sort,
    page,
    limit,
  });

  const matches = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = (val: MatchStatus | 'all') => {
    setStatus(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSportChange = (val: string) => {
    setSport(val);
    setPage(1);
  };

  const handleSortChange = (val: MatchSortOption) => {
    setSort(val);
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setSport('');
    setSort('date_desc');
    setPage(1);
  };

  return (
    <div className="space-y-6 bg-card/10 p-6 rounded-2xl border border-border/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold tracking-tight font-display">Manage Matches Listings</h3>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as MatchStatus | 'all')}
            className="bg-secondary/40 border-border/50 focus:ring-primary focus:ring-offset-0 h-9 text-xs rounded-md w-32 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="live">Live Now</option>
            <option value="scheduled">Scheduled</option>
            <option value="finished">Finished</option>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-full h-9 w-9 p-0 border-border/40 hover:bg-secondary cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <MatchSearchBar value={search} onChange={handleSearchChange} placeholder="Search matches by team..." />
        </div>
        <MatchAdvancedFilters
          sport={sport}
          onSportChange={handleSportChange}
          sort={sort}
          onSortChange={handleSortChange}
          onReset={handleReset}
        />
      </div>

      {/* Matches List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl bg-secondary/10 animate-pulse border border-border/10" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-sm text-red-400 font-semibold">
            Failed to load admin matches listing.
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-xl border border-border/40 bg-card/40 p-12 text-center text-muted-foreground font-semibold text-sm">
            No matches found matching the criteria.
          </div>
        ) : (
          matches.map((match) => (
            <MatchListItem
              key={match.id}
              match={match}
              action={
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full font-semibold border-border/85 hover:bg-secondary text-xs h-8 px-3 cursor-pointer shrink-0"
                    asChild
                  >
                    <Link to={`/admin/matches/${match.id}/commentary`}>
                      <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
                      Commentary
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary text-xs h-8 w-8 p-0 cursor-pointer shrink-0"
                    asChild
                  >
                    <Link to={`/matches/${match.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">View Live</span>
                    </Link>
                  </Button>
                </div>
              }
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && (
        <MatchPagination
          page={page}
          totalPages={meta.totalPages}
          hasNext={meta.hasNext}
          hasPrev={meta.hasPrev}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
