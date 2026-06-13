import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MatchPaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export function MatchPagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: MatchPaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          type="button"
          variant={page === i ? 'success' : 'outline'}
          onClick={() => onPageChange(i)}
          className={`h-9 w-9 rounded-full font-bold p-0 text-xs transition-all duration-200 border-border/40 ${
            page === i
              ? 'shadow-md shadow-primary/20 scale-105'
              : 'bg-secondary/30 hover:bg-secondary/60'
          }`}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4 border-t border-border/10">
      <Button
        type="button"
        variant="outline"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        className="h-9 w-9 rounded-full p-0 bg-secondary/30 hover:bg-secondary/60 border-border/40 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>

      <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

      <Button
        type="button"
        variant="outline"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        className="h-9 w-9 rounded-full p-0 bg-secondary/30 hover:bg-secondary/60 border-border/40 disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
