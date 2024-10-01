import React from "react";
import Image from "next/image";
import YellowStar from "./../../public/yellow-star.svg";
import EmptyStar from "./../../public/empty-star.svg";

const StarRating = ({ rating, large }: { rating: number; large?: boolean }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <div
          key={index}
          className={`mr-1 flex ${
            large ? "w-[2.35rem] h-[2.35rem] " : "w-6 h-6"
          }`}
        >
          <Image
            src={index < filledStars ? YellowStar : EmptyStar}
            alt={index < filledStars ? "Filled star" : "Empty star"}
            className={`${large && "pr-2"}`}
            width={large ? 50 : 35}
            height={large ? 50 : 35}
          />
        </div>
      ))}
    </div>
  );
};

export default StarRating;
