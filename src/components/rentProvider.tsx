"use client";

import { DateTimeRange } from "@/lib/types";
import DatePickerBase from "./DatePickerBase";
import { useState } from "react";

interface RentProviderProps {
  price: string;
}

const RentProvider: React.FC<RentProviderProps> = ({ price }) => {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(
    undefined
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined
  );

  const handleRent = (data: {
    dateRange: DateTimeRange | undefined;
    selectedCity: string | undefined;
  }) => {
    console.log("Renting with:", data);
  };

  return (
    <DatePickerBase
      mode="rent"
      dateRange={dateRange}
      setDateRange={setDateRange}
      selectedCity={selectedCity}
      setSelectedCity={setSelectedCity}
      onSubmit={handleRent}
      showTimeSelect={true}
      price={price}
    />
  );
};
export default RentProvider;
