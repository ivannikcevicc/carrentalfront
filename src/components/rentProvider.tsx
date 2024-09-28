"use client";

import React, { useState } from "react";
import RentDate from "@/components/rentDate";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

const RentProvider = () => {
  // Form state
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      dateRange,
      startTime,
      endTime,
      selectedCity,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <RentDate
        dateRange={dateRange}
        setDateRange={setDateRange}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default RentProvider;
