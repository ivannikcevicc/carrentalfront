import React from "react";
import { HeartButton } from "./heart-button";

import Gas from "./../../public/icons/gas.svg";
import SteeringWheel from "./../../public/icons/steerin.svg";
import Profile from "./../../public/icons/profile.svg";
import { Button } from "./ui/button";
import { Car } from "./../lib/types";
import Link from "next/link";

const card = ({ car }: { car: Car }) => {
  return (
    <div className="bg-white p-6 rounded-md gap-4 flex flex-col">
      <div className="flex  justify-between">
        <div className="flex gap-[.2rem] flex-col">
          <span className="text-[20px] font-bold">{car.make}</span>
          <span className="text-[14px] font-semibold text-gray-400">
            {car.type}
          </span>
        </div>

        <HeartButton carId={car.id} />
      </div>
      <img
        src={car.images}
        alt="car"
        className="w-[80%] mx-auto h-auto my-[2rem]"
      />
      <div className="flex gap-4 items-center justify-around text-gray-400 flex-wrap">
        <span className="flex gap-1">
          <img src={Gas.src} alt="gas" /> {car.fuel_capacity}L
        </span>
        <span className="flex gap-1">
          <img src={SteeringWheel.src} alt="steering wheel" />{" "}
          {car.transmission}
        </span>
        <span className="flex gap-1">
          <img src={Profile.src} alt="profile" /> {car.seating_capacity} People
        </span>
      </div>
      <div className="flex justify-between font-semibold flex-wrap text-[14px] mt-4 text-gray-400 gap-2">
        <div>
          {" "}
          <span className="text-[20px] text-black">
            ${car.price_per_day}/
          </span>{" "}
          day
        </div>
        <Link href={`/cars/${car.id}`}>
          <Button className="rounded-sm">Rent Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default card;
