import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/components/EmptyState';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <EmptyState
        tone="empty"
        title="Page Not Found (404)"
        message="The page you are looking for does not exist or has been moved."
        action={
          <Button asChild variant="success" className="rounded-full font-semibold px-6 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/">Back to Home</Link>
          </Button>
        }
      />
    </div>
  );
}

export default NotFoundPage;
