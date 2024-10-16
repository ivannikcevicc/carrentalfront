import React from "react";
import { getVehicles } from "@/lib/queries";
import Link from "next/link";

const RecommendVehicles = async ({
  type,
  currentCarId,
}: {
  type: string;
  currentCarId: number;
}) => {
  const cars = await getVehicles({ type: [type] });
  const displayedCars = cars.data
    .filter((car) => car.id !== currentCarId)
    .slice(0, 5);

  return (
    <div className="flex flex-col rounded-2xl bg-white px-6 py-8 lg:mt-0 mt-4 shadow-md">
      <h2 className="font-bold text-xl mb-6 text-gray-800">Recommended Cars</h2>
      <div className="flex flex-col gap-6">
        {displayedCars.map((car) => (
          <Link href={`/cars/${car.id}`} key={car.id}>
            <div className="flex items-stretch rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-md hover:border-primary border-2 border-transparent">
              <div className="w-1/4 min-w-[100px] max-w-[150px]">
                <img
                  src={JSON.parse(car.images)[0]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover rounded-l-md"
                />
              </div>
              <div className="flex-grow border-b border-gray-200 pl-4 py-2 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {car.make} {car.model}
                  </div>
                  <p className="text-sm text-gray-600">
                    {car.description.slice(0, 50)}...
                  </p>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className="font-semibold">{car.year}</span>
                  <span className="font-semibold">{car.transmission}</span>
                  <span className="font-semibold">{car.fuel_type}</span>
                  <span className="font-semibold mr-2">
                    ${car.price_per_day}/day
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendVehicles;
