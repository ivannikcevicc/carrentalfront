import React from "react";
import Image from "next/image";
import YellowStar from "./../../public/yellow-star.svg";
import EmptyStar from "./../../public/empty-star.svg";

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <div key={index} className="w-6 h-6 mr-1">
          <Image
            src={index < filledStars ? YellowStar : EmptyStar}
            alt={index < filledStars ? "Filled star" : "Empty star"}
            width={35}
            height={35}
          />
        </div>
      ))}
    </div>
  );
};

export default StarRating;
