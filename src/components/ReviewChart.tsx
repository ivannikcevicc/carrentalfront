import React from "react";
import StarRating from "./starRating";
import { Progress } from "./ui/progress";

const ReviewChart = () => {
  const ratings = [
    { label: "5 stars", value: 67, count: 488 },
    { label: "4 stars", value: 67, count: 90 },
    { label: "3 stars", value: 67, count: 488 },
    { label: "2 stars", value: 67, count: 488 },
    { label: "1 star", value: 67, count: 488 },
  ];

  return (
    <div className="gap-[2rem] flex md:flex-row md:gap-[8%] flex-col rounded-2xl bg-white p-5 px-8">
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-lg mb-2">Reviews</span>
        <div className="flex  items-center">
          <div className="">
            <span className="font-extrabold text-[50px] leading-8">4.7</span>
            <div className="my-4">
              {" "}
              <StarRating rating={4.7} large={true} />
            </div>
            <span className="text-gray-500 font-semibold">(578 Reviews)</span>
          </div>
        </div>{" "}
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-col gap-2 w-full">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="flex text-[14px] font-semibold items-center justify-between"
            >
              <span>{rating.label}</span>
              <Progress
                value={rating.value}
                className="text-amber-400 amber-400 w-[70%]"
              />
              <span>{rating.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewChart;
