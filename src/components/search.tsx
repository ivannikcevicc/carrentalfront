"use client";

import { DateTimeRange } from "@/lib/types";
import DatePickerBase from "./DatePickerBase";
import { useState } from "react";

const Search = () => {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>(
    undefined
  );
  // Dates are saved in a Date format. We need to convert them to ISO strings before sending them to the API.
  //  const fromISO = formatToISOString(dateRange.from, dateRange.startTime);
  //  const toISO = formatToISOString(dateRange.to, dateRange.endTime);

  const handleSearch = (data: {
    dateRange: DateTimeRange | undefined;
    selectedCity: string | undefined;
  }) => {
    console.log("Searching with:", data);
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
