import { useEffect, useRef, useState } from 'react';
import { Commentary } from '@/shared/types/models';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { Activity, ArrowUp } from 'lucide-react';
import { CommentaryItem } from './CommentaryItem';
import { CommentaryItemSkeleton } from './CommentaryItemSkeleton';
import { CommentaryTimelineEmpty } from './CommentaryTimelineEmpty';
import { ConnectionStatus } from '@/shared/components/ConnectionStatus';
import { useVirtualizer } from '@tanstack/react-virtual';

export function CommentaryTimeline({ 
  commentaries, 
  isLoading 
}: { 
  commentaries: Commentary[]; 
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prevCountRef = useRef(commentaries.length);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isScrolledDown = container.scrollTop > 80;
      setShowScrollTop(isScrolledDown);
      if (!isScrolledDown) {
        setHasUnread(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNewEvent = commentaries.length > prevCountRef.current;
    
    if (isNewEvent) {
      if (container.scrollTop <= 80) {
        // Auto scroll to top if user is near top
        container.scrollTo({ top: 0, behavior: 'smooth' });
        setHasUnread(false);
      } else {
        // Show notification if user has scrolled down
        setHasUnread(true);
      }
    }
    prevCountRef.current = commentaries.length;
  }, [commentaries.length]);

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setHasUnread(false);
  };

  // Sort commentaries: newest on top
  const sortedCommentaries = [...commentaries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const rowVirtualizer = useVirtualizer({
    count: sortedCommentaries.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col h-full min-h-[350px] md:min-h-[500px]">
      <CardHeader className="border-b border-border/40 bg-secondary/30 py-4 px-6 flex flex-row items-center justify-between gap-4 shrink-0">
        <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span>Live Commentary</span>
          {!isLoading && commentaries.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
              {commentaries.length}
            </span>
          )}
        </CardTitle>
        <ConnectionStatus size="sm" />
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col relative overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border/40 overflow-y-auto">
            <CommentaryItemSkeleton />
            <CommentaryItemSkeleton />
            <CommentaryItemSkeleton />
          </div>
        ) : commentaries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <CommentaryTimelineEmpty />
          </div>
        ) : (
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {/* Visually hidden screen reader live region */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {hasUnread ? 'New commentary updates are available. Scroll up to read.' : ''}
            </div>

            {/* Floating Updates Notification */}
            {hasUnread && (
              <button
                type="button"
                onClick={handleScrollToTop}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all select-none border border-primary/25 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 motion-safe:animate-bounce" />
                <span>New updates available</span>
              </button>
            )}

            {/* Scroll Container with Timeline Line indicator */}
            <div 
              ref={containerRef}
              className="overflow-y-auto relative pr-1 flex-1 min-h-0"
              style={{ maxHeight: '600px' }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const com = sortedCommentaries[virtualItem.index];
                  return (
                    <div
                      key={com.id}
                      data-index={virtualItem.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <CommentaryItem commentary={com} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick scroll to top button */}
            {showScrollTop && !hasUnread && (
              <button
                type="button"
                onClick={handleScrollToTop}
                className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border/40 text-muted-foreground hover:text-foreground shadow-md hover:bg-accent transition-all cursor-pointer"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default CommentaryTimeline;
