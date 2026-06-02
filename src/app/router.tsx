import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/app/layout';
import ProtectedRoute from '@/app/protected-route';
import { LoadingState } from '@/shared/components/LoadingState';
import { MatchCardSkeleton, ScoreBoardSkeleton } from '@/features/matches/components';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';

const MatchListPage = lazy(() => import('@/features/matches/pages/MatchList'));
const MatchDetailPage = lazy(() => import('@/features/matches/pages/MatchDetail'));
const LoginForm = lazy(() => import('@/features/auth/components/LoginForm').then(m => ({ default: m.LoginForm })));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const CreateMatchPage = lazy(() => import('@/features/matches/pages/CreateMatch'));
const CreateCommentaryPage = lazy(() => import('@/features/commentary/pages/CreateCommentary'));
const ApiKeysPage = lazy(() => import('@/features/api-keys/pages/ApiKeysPage'));
const NotFoundPage = lazy(() => import('@/features/errors/pages/NotFoundPage'));

const MatchListPageFallback = () => (
  <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, idx) => (
        <MatchCardSkeleton key={idx} />
      ))}
    </div>
  </div>
);

const MatchDetailPageFallback = () => (
  <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-6">
    <ScoreBoardSkeleton />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<MatchListPageFallback />}>
            <MatchListPage />
          </Suspense>
        ),
      },
      {
        path: 'matches/:id',
        element: (
          <Suspense fallback={<MatchDetailPageFallback />}>
            <MatchDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
            <LoginForm />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'matches/create',
        element: (
          <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
            <CreateMatchPage />
          </Suspense>
        ),
      },
      {
        path: 'matches/:id/commentary',
        element: (
          <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
            <CreateCommentaryPage />
          </Suspense>
        ),
      },
      {
        path: 'api-keys',
        element: (
          <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
            <ApiKeysPage />
          </Suspense>
        ),
      },
    ],
  },
]);

