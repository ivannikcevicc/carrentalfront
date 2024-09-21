import React from "react";
import Card from "./card";
import { getVehicles } from "@/lib/queries";

const CarGrid = async ({ slim }: { slim?: boolean }) => {
  const cars = await getVehicles();
  return (
    <div
      className={`mt-[2rem] max-w-[1800px] mx-auto gap-[2.5rem] px-[2rem] grid  ${
        slim
          ? "lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
          : "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
      }`}
    >
      {cars.map((car) => (
        <div key={car.id}>
          <Card car={car} />
        </div>
      ))}
    </div>
  );
};

export default CarGrid;
