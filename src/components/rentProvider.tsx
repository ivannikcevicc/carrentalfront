"use client";

import { DateTimeRange } from "@/lib/types";
import DatePickerBase from "./DatePickerBase";
import { useState } from "react";
import { createReservation } from "@/lib/queries";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RentProviderProps {
  price: string;
  carId: number;
}

const RentProvider: React.FC<RentProviderProps> = ({ price, carId }) => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(
    undefined
  );

  const handleRent = async (data: { dateRange: DateTimeRange | undefined }) => {
    if (!data.dateRange?.from || !data.dateRange?.to) {
      toast.error("Please select a valid date range");
      return;
    }

    try {
      const response = await createReservation({
        vehicle_id: carId,
        start_date: data.dateRange.from,
        end_date: data.dateRange.to,
      });

      toast.success("Reservation created successfully!");
      router.refresh();
      return response;
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to create reservation. Please try again."
      );
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
      carId={carId}
    />
  );
};

export default RentProvider;
