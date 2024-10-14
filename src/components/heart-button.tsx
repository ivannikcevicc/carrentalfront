"use client";

import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavorites } from "./favoritesContext";
import { getUserInfo } from "@/lib/auth";

export const HeartButton = ({
  carId,
  size = 28,
  onToggle,
}: {
  carId: number;
  size?: number;
  onToggle?: (isFavorite: boolean) => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = async () => {
    if (isUpdating) return;

    const user = await getUserInfo();
    if (!user) {
      router.push("/login");
      return;
    }

    setIsUpdating(true);
    await toggleFavorite(carId);
    if (onToggle) {
      onToggle(isFavorite(carId));
    }
    router.refresh();
    setIsUpdating(false);
  };

  if (isUpdating) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div
      onClick={handleToggleFavorite}
      className={`relative hover:opacity-80 transition cursor-pointer translate-y-1`}
    >
      <AiOutlineHeart
        size={size + 4}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={size}
        className={isFavorite(carId) ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};
