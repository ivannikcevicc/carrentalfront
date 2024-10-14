"use client";

import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toggleFavorite } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/lib/auth";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

interface CarDetailsFavoriteButtonProps {
  carId: number;
  initialIsFavorite: boolean;
}

const CarDetailsFavoriteButton: React.FC<CarDetailsFavoriteButtonProps> = ({
  carId,
  initialIsFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggleFavorite = async () => {
    if (isUpdating) return;

    const user = await getUserInfo();
    if (!user) {
      router.push("/login");
      return;
    }

    setIsUpdating(true);
    try {
      await toggleFavorite(carId);
      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorite. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="focus:outline-none relative"
      disabled={isUpdating}
    >
      {isUpdating ? (
        <Loader className="animate-spin absolute inset-0 m-auto" size={44} />
      ) : (
        <>
          <AiOutlineHeart
            size={48}
            className="fill-white absolute -top-[2px] -right-[2px]"
          />
          <AiFillHeart
            size={44}
            className={isFavorite ? "fill-rose-500" : "fill-neutral-500/70"}
          />
        </>
      )}
    </button>
  );
};

export default CarDetailsFavoriteButton;
