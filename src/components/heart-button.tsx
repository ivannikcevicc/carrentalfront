"use client";

import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export const HeartButton = ({
  isFavorite,
  carId,
  size = 28,
}: {
  isFavorite: boolean;
  carId: string;
  size?: number;
}) => {
  const [hasFavorited, toggleFavorite] = useState(isFavorite);
  console.log(carId);

  // use CarID to toggle favorite

  return (
    <div
      onClick={() => toggleFavorite(!hasFavorited)}
      className=" relative hover opacity-80 transition cursor-pointer translate-y-1"
    >
      <AiOutlineHeart
        size={size + 4}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={size}
        className={` ${hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}`}
      />
    </div>
  );
};
