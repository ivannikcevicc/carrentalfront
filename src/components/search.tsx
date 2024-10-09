"use client";

import { DateTimeRange } from "@/lib/types";
import DatePickerBase from "./DatePickerBase";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(undefined);

  // Sync dateRange with URL parameters on component mount and searchParams changes
  useEffect(() => {
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (startDate && endDate) {
      // Parse the ISO strings to Date objects
      const fromDate = new Date(startDate);
      const toDate = new Date(endDate);

      // Extract time components
      const startTime = `${fromDate.getHours().toString().padStart(2, '0')}:${fromDate.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${toDate.getHours().toString().padStart(2, '0')}:${toDate.getMinutes().toString().padStart(2, '0')}`;

      setDateRange({
        from: fromDate,
        to: toDate,
        startTime,
        endTime
      });
    } else {
      // Reset dateRange if no dates in URL
      setDateRange(undefined);
    }
  }, [searchParams]);

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