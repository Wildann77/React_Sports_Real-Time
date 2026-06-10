export function CommentaryItemSkeleton() {
  return (
    <div className="p-6 flex gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
      <div className="pt-2 space-y-3 flex-1">
        <div className="h-5 w-20 bg-muted rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
