"use client";
// types/date-picker.ts

import { DateRange } from "react-day-picker";

// components/DatePickerBase.tsx
import * as React from "react";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerProps } from "@/lib/types";


const DatePickerBase: React.FC<DatePickerProps> = ({
  dateRange,
  setDateRange,
  mode,
  showTimeSelect = false,
  onSubmit,
  submitButtonText,
  price,
}) => {


  const formatDateRange = () => {
    if (!dateRange?.from || !dateRange?.to) return "Pick a date range";

    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);

    if (showTimeSelect && dateRange.startTime && dateRange.endTime) {
      const [fromHours, fromMinutes] = dateRange.startTime.split(":");
      const [toHours, toMinutes] = dateRange.endTime.split(":");

      fromDate.setHours(parseInt(fromHours), parseInt(fromMinutes), 0);
      toDate.setHours(parseInt(toHours), parseInt(toMinutes), 0);

      const formattedFrom = format(fromDate, "MMM d, yyyy 'at' h:mm a");
      const formattedTo = format(toDate, "MMM d, yyyy 'at' h:mm a");

      return `${formattedFrom} - ${formattedTo}`;
    }

    const formattedFrom = format(fromDate, "MMM d, yyyy");
    const formattedTo = format(toDate, "MMM d, yyyy");

    return `${formattedFrom} - ${formattedTo}`;
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from) return;

    let { from, to } = range;

    if (from && !to) {
      to = endOfDay(addDays(from, 1));
    }

    if (from && to && to < from) {
      [from, to] = [to, from];
    }

    setDateRange({
      ...dateRange,
      from: startOfDay(from),
      to: endOfDay(to || addDays(from, 1)),
    });
  };

  const handleTimeChange = (time: string, isStart: boolean) => {
    if (!dateRange) return;

    setDateRange({
      ...dateRange,
      [isStart ? "startTime" : "endTime"]: time,
    });
  };

  const formatToISOString = (date: Date, time?: string): string => {
    const [hours, minutes] = time ? time.split(":") : ["00", "00"];
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return newDate.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange?.from || !dateRange?.to) return;

    const fromISO = formatToISOString(dateRange.from, dateRange.startTime);
    const toISO = formatToISOString(dateRange.to, dateRange.endTime);

    console.log("From Date ISO:", fromISO);
    console.log("To Date ISO:", toISO);

    onSubmit?.({
      dateRange: {
        ...dateRange,
        //@ts-expect-error Type 'DateTimeRange' is not assignable to type 'DateRange'.
        from: fromISO,
        //@ts-expect-error Type 'DateTimeRange' is not assignable to type 'DateRange'.
        to: toISO,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4">
      <div className="lg:max-w-[1000px] sm:max-w-[90%] md:max-w-[85%] max-w-[95%] bg-white mt-[3rem] mx-auto rounded-lg py-6 pr-6">
        <div className="flex items-center flex-wrap gap-6 md:gap-0 justify-around">
          <div className="lg:divide-x-2 flex gap-6 md:gap-0 flex-wrap justify-center">

            {/* Date Selection */}
            <div className="flex flex-col gap-4 sm:px-10 px-5 xl:mb-0 mb-6">
              <span className="font-semibold">Pickup and Return Date</span>
              <div className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="sm:text-sm text-xs">
                        {formatDateRange()}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                    />
                    {showTimeSelect && (
                      <div className="grid grid-cols-2 gap-2 p-3 border-t border-border">
                        <div>
                          <label
                            htmlFor="start-time"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Start Time
                          </label>
                          <div className="relative">
                            <Input
                              type="time"
                              id="start-time"
                              value={dateRange?.startTime || "09:00"}
                              onChange={(e) =>
                                handleTimeChange(e.target.value, true)
                              }
                              className="pl-8"
                            />
                            <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="end-time"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            End Time
                          </label>
                          <div className="relative">
                            <Input
                              type="time"
                              id="end-time"
                              value={dateRange?.endTime || "17:00"}
                              onChange={(e) =>
                                handleTimeChange(e.target.value, false)
                              }
                              className="pl-8"
                            />
                            <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {mode === "search" ? (
            <Button type="submit" className="flex-1 py-6 ml-6">
              {submitButtonText || "Search"}
            </Button>
          ) : null}
        </div>
      </div>

      {mode === "rent" && price && (
        <div className="flex justify-between font-semibold flex-wrap text-[22px] mt-10 text-gray-400 gap-2">
          <div>
            <span className="text-[40px] text-black">${price}/</span> day
          </div>
          <Button
            type="submit"
            className="rounded-sm text-[20px] px-10 py-8 font-semibold"
          >
            {submitButtonText || "Rent Now"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default DatePickerBase;
