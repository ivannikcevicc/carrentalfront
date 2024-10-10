"use client";

import { DateTimeRange } from "@/lib/types";
import DatePickerBase from "./DatePickerBase";
import { useState } from "react";
import { createReservation } from "@/lib/queries";
import { toast } from "react-hot-toast";

interface RentProviderProps {
  price: string;
  carId: number;
}

const RentProvider: React.FC<RentProviderProps> = ({ price, carId }) => {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(
    undefined
  );

  const handleRent = async (data: { dateRange: DateTimeRange | undefined }) => {
    console.log("rent");
    if (!data.dateRange?.from || !data.dateRange?.to) {
      console.log("rent2");
      toast.error("Please select a valid date range");
      console.log("rent3");
      return;
    }

    try {
      console.log({
        vehicle_id: carId,
        start_date: data.dateRange.from,
        end_date: data.dateRange.to,
      });
      const response = await createReservation({
        vehicle_id: carId,
        start_date: data.dateRange.from,
        end_date: data.dateRange.to,
      });

      toast.success("Reservation created successfully!");
      return response;
    } catch (err) {
      console.error(err);
      toast.error("Failed to create reservation. Please try again.");
    }
  };

  return (
    <DatePickerBase
      mode="rent"
      dateRange={dateRange}
      setDateRange={setDateRange}
      onSubmit={handleRent}
      showTimeSelect={true}
      price={price}
    />
  );
};

export default RentProvider;
