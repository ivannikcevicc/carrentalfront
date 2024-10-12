"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { getFavoriteVehicles, toggleFavorite } from "@/lib/queries";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { getUserInfo } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const HeartButton = ({
  carId,
  size = 28,
  onToggle,
}: {
  carId: number;
  size?: number;
  onToggle?: (isFavorite: boolean) => void;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const user = await getUserInfo();
      if (!user) {
        setIsFavorite(false);
        return;
      }
      const favorites = await getFavoriteVehicles();
      const isFavorited = favorites.data.some((car) => car.id === carId);
      setIsFavorite(isFavorited);
    } catch (error) {
      toast.error(
        //@ts-expect-error expected
        err?.response?.data?.message ||
          "Failed to fetch favorites. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const handleToggleFavorite = async () => {
    const user = await getUserInfo();
    if (!user) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      await toggleFavorite(carId);
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      if (onToggle) {
        onToggle(newFavoriteStatus);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader></Loader>; // Or a loading spinner
  }

  return (
    <div
      onClick={handleToggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer translate-y-1"
    >
      <AiOutlineHeart
        size={size + 4}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={size}
        className={isFavorite ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};
