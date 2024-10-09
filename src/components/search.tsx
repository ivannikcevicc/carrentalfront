"use client";

import { DateTimeRange } from "@/lib/types";
import DatePickerBase from "./DatePickerBase";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(
    undefined
  );

  const handleSearch = (data: {
    dateRange: DateTimeRange | undefined;
    selectedCity: string | undefined;
  }) => {
    if (data.dateRange?.from && data.dateRange?.to) {
      const params = new URLSearchParams(searchParams.toString());

      // Format dates to ISO string without quotes
      const fromISO = new Date(data.dateRange.from).toISOString();
      const toISO = new Date(data.dateRange.to).toISOString();

      params.set("start_date", fromISO);
      params.set("end_date", toISO);

      // Update the URL with the new query parameters
      router.push(`/cars?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <DatePickerBase
      mode="search"
      dateRange={dateRange}
      setDateRange={setDateRange}
      onSubmit={handleSearch}
      showTimeSelect={true}
    />
  );
};

export default Search;
