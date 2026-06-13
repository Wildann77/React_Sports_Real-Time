import { Button } from '@/shared/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function ShareButton() {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleShare}
      className="rounded-full h-10 w-10 p-0 border-border/40 bg-secondary/30 hover:bg-secondary/60 text-muted-foreground transition-all duration-200 cursor-pointer"
    >
      <Share2 className="h-4.5 w-4.5" />
      <span className="sr-only">Share</span>
    </Button>
  );
}
