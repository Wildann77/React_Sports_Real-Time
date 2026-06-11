import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ShieldOff,
  Key
} from 'lucide-react';
import { useMatches, useMatchKpis } from '@/features/matches/hooks';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useLogoutAllMutation } from '@/features/auth/hooks/use-auth-mutations';
import { ErrorState } from '@/shared/components/ErrorState';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { getErrorMessage } from '@/shared/lib/errors';
import { toast } from 'sonner';
import { useDocumentTitle } from '@/shared/hooks';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { DashboardSummaryCard } from '../components/DashboardSummaryCard';
import { LiveMatchesWidget } from '../components/LiveMatchesWidget';
import { TodayMatchesWidget } from '../components/TodayMatchesWidget';
import { QuickStatsWidget } from '../components/QuickStatsWidget';
import { RecentCommentaryWidget } from '../components/RecentCommentaryWidget';

export default function DashboardPage() {
  useDocumentTitle('Admin Dashboard');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Call useMatches with object params
  const { data, isLoading, isError, error, refetch } = useMatches({ status: 'all', limit: 100 });

  const logoutAllMutation = useLogoutAllMutation({
    onSuccess: () => {
      toast.success('Successfully logged out from all devices.');
      navigate('/login');
    },
    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, 'Failed to logout all sessions.'));
    },
  });

  const matches = data?.data || [];
  const { liveCount, scheduledCount, finishedCount } = useMatchKpis(matches);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl p-4 w-full">
        <ErrorState message={getErrorMessage(error, 'Failed to load dashboard.')} retry={refetch} />
      </div>
    );
  }

  const liveMatches = matches.filter((m) => m.status === 'live');

  const userDisplayName = user?.email ? user.email.split('@')[0] : 'Admin';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Premium Welcome Header Card */}
      <DashboardSummaryCard
        displayName={userDisplayName}
        totalMatches={matches.length}
        liveMatches={liveCount}
      />

      {/* KPI Stats Strip Widget */}
      <QuickStatsWidget
        totalCount={matches.length}
        liveCount={liveCount}
        scheduledCount={scheduledCount}
        finishedCount={finishedCount}
      />

      {/* Layout Grid: 2/3 and 1/3 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Live Matches Widget */}
        <div className="space-y-6 lg:col-span-2">
          <LiveMatchesWidget matches={liveMatches} />
          
          <div className="border-t border-border/10 pt-6">
            <TodayMatchesWidget />
          </div>
        </div>

        {/* Right Column: Quick Actions & Recent Commentary Widget */}
        <div className="space-y-6">
          <div>
            <SectionHeader title="Quick Actions" />
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base font-bold font-display">Control Centre</CardTitle>
                <CardDescription className="text-xs">Quick shortcuts to manage features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="success" className="w-full rounded-full font-bold cursor-pointer">
                  <Link to="/admin/matches/create">
                    <PlusCircle className="mr-1.5 h-4 w-4" />
                    Create New Match
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full rounded-full font-semibold border-border/85 hover:bg-secondary cursor-pointer">
                  <Link to="/admin/api-keys">
                    <Key className="mr-1.5 h-4 w-4" />
                    Manage API Keys
                  </Link>
                </Button>

                <div className="border-t border-border/40 pt-4 mt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full rounded-full font-semibold transition-all hover:bg-red-500/90 cursor-pointer"
                    onClick={() => logoutAllMutation.mutate()}
                    disabled={logoutAllMutation.isPending}
                  >
                    <ShieldOff className="mr-1.5 h-4 w-4" />
                    {logoutAllMutation.isPending ? 'Logging out...' : 'Logout All Devices'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-border/10 pt-6">
            <RecentCommentaryWidget matches={matches} />
          </div>
        </div>
      </div>
    </div>
  );
}
