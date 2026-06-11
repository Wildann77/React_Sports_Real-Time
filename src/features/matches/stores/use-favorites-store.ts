import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesState = {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((state) => {
          const isFav = state.favoriteIds.includes(id);
          const favoriteIds = isFav
            ? state.favoriteIds.filter((favId) => favId !== id)
            : [...state.favoriteIds, id];
          return { favoriteIds };
        }),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'matches-favorites-storage',
    }
  )
);
