import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap';
import { queryClient } from '@/shared/lib/query-client';
import { GlobalErrorBoundary } from '@/shared/components/GlobalErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          {children}
          <Toaster richColors position="top-right" />
        </AuthBootstrap>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
