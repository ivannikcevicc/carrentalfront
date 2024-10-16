import ImgPick from "@/components/imgPick";
import StarRating from "@/components/starRating";
import RentProvider from "@/components/rentProvider";
import {
  getReviewsByCarId,
  getVehicle,
  getReservations,
  getFavoriteVehicles,
} from "@/lib/queries"; // Import deleteReservation
import ReviewChart from "@/components/ReviewChart";
import ReviewProvider from "@/components/ReviewProvider";
import RecommendVehicles from "@/components/RecommendVehicles";
import { format } from "date-fns";
import DeleteButton from "./_components/DeleteButton";
import { getUserInfo } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info } from "lucide-react";
import CarDetailsFavoriteButton from "./_components/CarDetailsFavorite";
import { Car, FavoriteResponse } from "@/lib/types";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMMM dd, yyyy 'at' hh:mm a");
};

const Page = async ({ params }: { params: { carId: number } }) => {
  const { carId } = params;

  const [car, reviews, user] = await Promise.all([
    getVehicle(carId),
    getReviewsByCarId(carId),
    getUserInfo(),
  ]);

  let initialIsFavorite = false;
  let favorites: FavoriteResponse = {
    data: [],
    current_page: 1,
    first_page_url: "",
    from: 1,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 10,
    prev_page_url: null,
    to: 1,
    total: 0,
  };

  if (user) {
    favorites = await getFavoriteVehicles();
    initialIsFavorite = favorites.data.some(
      (favCar: Car) => favCar.id === Number(carId)
    );
  }

  let currentReservation;
  if (user) {
    const reservations = await getReservations();
    currentReservation = reservations.find(
      (reservation) => reservation.vehicle_id == carId
    );
  }
  const carDetails = [
    { label: "Type Car", value: car.type },
    { label: "Capacity", value: `${car.seating_capacity} Person` },
    { label: "Fuel Type", value: car.fuel_type },
    { label: "Steering", value: car.transmission },
    { label: "Gasoline", value: car.fuel_capacity },
    { label: "Year", value: car.year },
  ];

  const description = car.description;
  const maxLength = 288;

  return (
    <>
      <div className="p-[3.5%] flex lg:flex-row flex-col gap-[4%] ">
        <aside className="lg:w-[47%] w-full">
          <ImgPick car={car} />
        </aside>
        <main className="lg:w-[53%] w-full">
          <div className="rounded-2xl bg-white p-8 flex flex-col">
            <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2 sm:gap-8 ">
              <h2 className="text-[2rem] sm:text-[2.75rem] font-bold">
                {car.make}
              </h2>
              <CarDetailsFavoriteButton
                carId={carId}
                initialIsFavorite={initialIsFavorite}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-3 items-start sm:items-center mt-5 mb-[1rem]">
              <StarRating rating={3.5} />
              <span className="text-gray-500 text-[20px]">440+ Reviews</span>
            </div>
            <p className="overflow-hidden text-ellipsis mt-[2rem] leading-relaxed text-gray-800 text-[18px] sm:text-[26px]">
              {truncateText(description, maxLength)}
            </p>
            <div className="flex flex-col sm:grid sm:grid-cols-2 2xl:grid-cols-3 sm:grid-rows-3 2xl:grid-rows-2 gap-x-8 gap-4 mt-[2rem] text-[20px] xl:text-[25px]">
              {carDetails.map((detail, index) => (
                <div
                  key={index}
                  className="w-full flex justify-between items-center"
                >
                  <span className="text-gray-500 sm:text-[22px] text-[14px]">
                    {detail.label}
                  </span>
                  <span className="font-semibold sm:text-[22px] text-[14px]">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
            {!user ? (
              <div className="flex flex-col gap-12 mt-12">
                <span className="text-[20px] flex gap-2 items-center justify-center font-semibold text-center text-red-400">
                  <Info /> Log in to start your car rentals
                </span>
                <div className="flex justify-between font-semibold flex-wrap text-[18px] sm:text-[22px] text-gray-400 gap-3">
                  <div>
                    <span className="text-[30px] sm:text-[40px] text-black">
                      ${car.price_per_day}/
                    </span>{" "}
                    day
                  </div>
                  <Link href={"/login"}>
                    <Button className="rounded-sm text-[16px] sm:text-[20px] px-8 py-6 sm:px-10 sm:py-8 font-semibold">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : currentReservation ? (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Your Reservation</h3>
                <p>
                  <strong>Status:</strong> {currentReservation.status}
                </p>
                <p>
                  <strong>From:</strong>{" "}
                  {formatDate(currentReservation.start_date)}
                </p>
                <p>
                  <strong>To:</strong> {formatDate(currentReservation.end_date)}
                </p>
                <p>
                  <strong>Total Price:</strong> $
                  {currentReservation.total_price}
                </p>
                <DeleteButton reservationId={currentReservation.id} />
              </div>
            ) : (
              <RentProvider price={car.price_per_day} carId={car.id} />
            )}
          </div>
        </main>
      </div>
      <div className="p-[3.5%] pt-0 flex lg:flex-row flex-col gap-[4%]">
        <div className="lg:w-[47%] w-full flex flex-col">
          <ReviewChart carId={carId} />
          <ReviewProvider reviews={reviews} user={user} />
        </div>
        <div className="lg:w-[53%] w-full flex flex-col">
          <RecommendVehicles type={car.type} currentCarId={carId} />
        </div>
      </div>
    </>
  );
};

export default Page;
