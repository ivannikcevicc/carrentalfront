import React from "react";
import StarRating from "./starRating";
import { Progress } from "./ui/progress";

const ReviewChart = () => {
  return (
    <div className="gap-[8%] flex rounded-2xl bg-white p-5 px-8">
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
          <div className="flex  text-[14px] font-semibold items-center justify-between ">
            <span>5 stars</span>
            <Progress value={67} className="text-amber-400 amber-400 w-[70%]" />
            <span>488</span>
          </div>
          <div className="flex  text-[14px] font-semibold items-center justify-between ">
            <span>4 stars</span>
            <Progress value={67} className="text-amber-400 amber-400 w-[70%]" />
            <span>90</span>
          </div>
          <div className="flex  text-[14px] font-semibold items-center justify-between ">
            <span>3 stars</span>
            <Progress value={67} className="text-amber-400 amber-400 w-[70%]" />
            <span>488</span>
          </div>
          <div className="flex  text-[14px] font-semibold items-center justify-between ">
            <span>2 stars</span>
            <Progress value={67} className="text-amber-400 amber-400 w-[70%]" />
            <span>488</span>
          </div>
          <div className="flex  text-[14px] font-semibold items-center justify-between ">
            <span>1 star</span>
            <Progress value={67} className="text-amber-400 amber-400 w-[70%]" />
            <span>488</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewChart;
