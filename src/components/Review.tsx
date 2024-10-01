import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import StarRating from "./starRating";
import { Review as ReviewType } from "@/lib/types";

// Helper function to format the date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options); // Format as "Jan 20, 2024"
};

const Review = ({ review }: { review: ReviewType }) => {
  return (
    <div className="py-5">
      <div className="flex gap-5 items-center ">
        <Avatar className=" flex sm:h-[45px] sm:w-[45px] w-[35px] h-[35px]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <span className="text-[18px] font-semibold">{review.user.name}</span>
      </div>
      <div className="my-4 flex gap-4 items-center">
        <StarRating rating={review.rating} />{" "}
        <span className="text-gray-400 font-semibold text-[17px]">
          {formatDate(review.created_at)}
        </span>
      </div>
      <p className="text-[18px]  text-gray-800">{review.comment}</p>
    </div>
  );
};

export default Review;
