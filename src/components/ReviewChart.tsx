import React from "react";
import StarRating from "./starRating";
import { Progress } from "./ui/progress";
import { getReviewsInfoByCarId } from "@/lib/queries";

const ReviewChart = async ({ carId }: { carId: number }) => {
  const info = await getReviewsInfoByCarId(carId);

  const totalReviews = info.total_reviews;
  const ratings = [
    {
      label: "5 stars",
      value: (info.stars["5_stars"] / totalReviews) * 100,
      count: info.stars["5_stars"],
    },
    {
      label: "4 stars",
      value: (info.stars["4_stars"] / totalReviews) * 100,
      count: info.stars["4_stars"],
    },
    {
      label: "3 stars",
      value: (info.stars["3_stars"] / totalReviews) * 100,
      count: info.stars["3_stars"],
    },
    {
      label: "2 stars",
      value: (info.stars["2_stars"] / totalReviews) * 100,
      count: info.stars["2_stars"],
    },
    {
      label: "1 star",
      value: (info.stars["1_star"] / totalReviews) * 100,
      count: info.stars["1_star"],
    },
  ];

  return (
    <div className="gap-[2rem] flex md:flex-row md:gap-[8%] flex-col rounded-2xl bg-white p-5 px-8">
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-lg mb-2">Reviews</span>
        <div className="flex items-center">
          <div className="">
            <span className="font-extrabold text-[50px] leading-8">
              {info.average_rating.toFixed(1)}
            </span>
            <div className="my-4">
              <StarRating rating={info.average_rating} large={true} />
            </div>
            <span className="text-gray-500 font-semibold">
              ({info.total_reviews} Review{info.total_reviews !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
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
