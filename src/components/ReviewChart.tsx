import React from "react";
import StarRating from "./starRating";

const ReviewChart = () => {
  return (
    <div className="gap-[8%] flex">
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
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <span>aaaaaaaaaaaaaaaa</span>
          <span>aaaaaaaaaaaaaaaa</span>
          <span>aaaaaaaaaaaaaaaa</span>
          <span>aaaaaaaaaaaaaaaa</span>
          <span>aaaaaaaaaaaaaaaa</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewChart;
