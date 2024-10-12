import React from "react";
import Card from "./card";
import { Car } from "@/lib/types";

interface CarGridProps {
  extraSlim?: boolean;
  slim?: boolean;
  filter?: boolean;
  cars: Car[];
}

const CarGrid: React.FC<CarGridProps> = ({ extraSlim, slim, filter, cars }) => {
  if (extraSlim && slim) {
    console.warn(
      "Both extraSlim and slim props are set. Using extraSlim configuration."
    );
  }

  // Now that we have the cars, we can safely filter them
  const displayedCars = filter ? cars.slice(0, 4) : cars;

  const gridClasses = extraSlim
    ? "2xl:grid-cols-3 xl:grid-cols-2 grid-cols-1"
    : slim
    ? "xl:grid-cols-3 sm:grid-cols-2 grid-cols-1"
    : "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1";

  return (
    <div
      className={`mt-[2rem] mb-[4rem] max-w-[1800px] mx-auto gap-[2.5rem] px-[2rem] grid ${gridClasses}`}
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
