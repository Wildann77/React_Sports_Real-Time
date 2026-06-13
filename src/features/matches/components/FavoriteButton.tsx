import { Button } from '@/shared/ui/button';
import { Star } from 'lucide-react';
import { useFavoritesStore } from '../stores/use-favorites-store';

interface FavoriteButtonProps {
  matchId: number;
}

export function FavoriteButton({ matchId }: FavoriteButtonProps) {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFav = useFavoritesStore((state) => state.favoriteIds.includes(matchId));

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => toggleFavorite(matchId)}
      className={`rounded-full h-10 w-10 p-0 border-border/40 bg-secondary/30 hover:bg-secondary/60 transition-all duration-200 cursor-pointer ${
        isFav ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' : 'text-muted-foreground'
      }`}
    >
      <Star className="h-4.5 w-4.5" fill={isFav ? 'currentColor' : 'none'} />
      <span className="sr-only">Favorite</span>
    </Button>
  );
}
