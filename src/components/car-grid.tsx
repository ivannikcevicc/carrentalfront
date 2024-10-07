import React from "react";
import Card from "./card";

import { Car } from "@/lib/types";

const CarGrid = async ({
  slim,
  filter,
  cars,
}: {
  slim?: boolean;
  filter?: boolean;
  cars: Car[];
}) => {
  // Now that we have the cars, we can safely filter them
  const displayedCars = filter ? cars.slice(0, 4) : cars;

  return (
    <div
      className={`mt-[2rem] mb-[4rem] max-w-[1800px] mx-auto gap-[2.5rem] px-[2rem] grid  ${
        slim
          ? "lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
          : "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
      }`}
    >
      {displayedCars.map((car) => (
        <div key={car.id}>
          <Card car={car} />
        </div>
      ))}
    </div>
  );
};

export default CarGrid;
