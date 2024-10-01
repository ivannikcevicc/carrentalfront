import ImgPick from "@/components/imgPick";
import { HeartButton } from "@/components/heart-button";
import StarRating from "@/components/starRating";

import RentProvider from "@/components/rentProvider";
import { getVehicle } from "@/lib/queries";
import ReviewChart from "@/components/ReviewChart";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Page = async ({ params }: { params: { carId: string } }) => {
  const { carId } = params;

  const car = await getVehicle(carId);

  // Sample text content
  const description = car.description;
  // Define the max length for truncation
  const maxLength = 288; // Adjust as needed

  return (
    <>
      <div className="p-[3.5%] flex gap-[4%] ">
        <aside className="w-[47%]">
          <ImgPick />
        </aside>
        <main className="w-[53%] rounded-2xl bg-white p-8 flex flex-col">
          <div className="flex items-center gap-8 ">
            <h2 className="text-[2.75rem] font-bold">{car.make}</h2>
            <HeartButton carId={carId} isFavorite={false} size={44} />
          </div>
          <div className="flex gap-3 items-center mt-2 mb-[1rem]">
            <StarRating rating={3.5} />
            <span className="text-gray-500 text-[20px]">440+ Reviews</span>
          </div>
          <p className="overflow-hidden text-ellipsis mt-[2rem] leading-relaxed text-gray-800  text-[26px]">
            {truncateText(description, maxLength)}
          </p>
          <div className="grid grid-cols-2 2xl:grid-cols-3  grid-rows-3 2xl:grid-rows-2  gap-x-8 gap-4 mt-[2rem] text-[20px] xl:text-[25px]">
            <div className="w-full flex justify-between items-center">
              <span className="text-gray-500">Type Car</span>
              <span className="font-semibold">{car.type}</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-gray-500">Capacity</span>
              <span className="font-semibold">
                {car.seating_capacity} Person
              </span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-gray-500">Fuel Type</span>
              <span className="font-semibold">{car.fuel_type}</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-gray-500">Steering</span>
              <span className="font-semibold">{car.transmission}</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-gray-500">Gasoline</span>
              <span className="font-semibold">{car.fuel_capacity}</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-gray-500">Year</span>
              <span className="font-semibold">{car.year}</span>
            </div>
          </div>
          <RentProvider price={car.price_per_day} />
        </main>
      </div>
      <div className="p-[3.5%] pt-0 flex gap-[4%]">
        <div className="w-[47%] rounded-2xl bg-white p-5 flex flex-col">
          <ReviewChart />
        </div>
        <div className="w-[53%] rounded-2xl bg-white p-5 flex flex-col">a</div>
      </div>
    </>
  );
};

export default Page;
