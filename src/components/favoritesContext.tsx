import React, { createContext, useContext, useState, useEffect } from "react";
import { getFavoriteVehicles, toggleFavorite } from "@/lib/queries";
import { getUserInfo } from "@/lib/auth";
import toast from "react-hot-toast";

type FavoritesContextType = {
  favorites: Set<number>;
  toggleFavorite: (carId: number) => Promise<void>;
  isFavorite: (carId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider: React.FC<{
  children: React.ReactNode;
  initialFavorites?: number[];
}> = ({ children, initialFavorites = [] }) => {
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(initialFavorites)
  );

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = await getUserInfo();
        if (user) {
          const favoritesData = await getFavoriteVehicles();
          setFavorites(new Set(favoritesData.data.map((car) => car.id)));
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    if (initialFavorites.length === 0) {
      fetchFavorites();
    }
  }, [initialFavorites]);

  const toggleFavoriteStatus = async (carId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(carId)) {
      newFavorites.delete(carId);
    } else {
      newFavorites.add(carId);
    }
    setFavorites(newFavorites);

    try {
      await toggleFavorite(carId);
      toast.success(
        newFavorites.has(carId)
          ? "Added to favorites"
          : "Removed from favorites"
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorite. Please try again.");
      // Revert the optimistic update
      setFavorites(favorites);
    }
  };

  const isFavorite = (carId: number) => favorites.has(carId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite: toggleFavoriteStatus, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
