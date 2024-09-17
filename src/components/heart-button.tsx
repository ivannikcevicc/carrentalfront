"use client";

import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export const HeartButton = ({
  isFavorite,
  carId,
}: {
  isFavorite: boolean;
  carId: string;
}) => {
  const [hasFavorited, toggleFavorite] = useState(isFavorite);

  // use CarID to toggle favorite

  return (
    <div
      onClick={() => toggleFavorite(!hasFavorited)}
      className=" relative hover opacity-80 transition cursor-pointer translate-y-1"
    >
      <AiOutlineHeart
        size={32}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={28}
        className={` ${hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}`}
      />
    </div>
  );
};
