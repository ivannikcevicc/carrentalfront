"use client";

import * as React from "react";
import {
  addDays,
  format,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { FaChevronDown } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import the country-state-city package
import { City } from "country-state-city";
import { ICity } from "country-state-city";

// Montenegro's ISO country code
const MONTENEGRO_COUNTRY_CODE = "ME";

const Search = () => {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [startTime, setStartTime] = React.useState<string>("09:00");
  const [endTime, setEndTime] = React.useState<string>("17:00");
  const [cities, setCities] = React.useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = React.useState<string | undefined>(
    undefined
  );
  // Format date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "LLL dd, y")} ${startTime} - ${format(
        dateRange.to,
        "LLL dd, y"
      )} ${endTime}`;
    }
    return "Pick a date and time range";
  };

  React.useEffect(() => {
    const montenegroCities = City.getCitiesOfCountry(MONTENEGRO_COUNTRY_CODE);

    // Ensure montenegroCities is defined before setting the state
    if (montenegroCities) {
      setCities(montenegroCities);
    } else {
      // Handle the case where no cities are found (if necessary)
      setCities([]);
    }
  }, []);

  // Function to update dateRange with new time values
  const updateDateRangeWithTime = (
    range: DateRange,
    newStartTime: string,
    newEndTime: string
  ) => {
    const fromDate = new Date(range.from as Date);
    const toDate = new Date(range.to as Date);

    const updatedFromDate = setMilliseconds(
      setSeconds(
        setMinutes(
          setHours(fromDate, parseInt(newStartTime.split(":")[0], 10)),
          parseInt(newStartTime.split(":")[1], 10)
        ),
        0
      ),
      0
    );
    const updatedToDate = setMilliseconds(
      setSeconds(
        setMinutes(
          setHours(toDate, parseInt(newEndTime.split(":")[0], 10)),
          parseInt(newEndTime.split(":")[1], 10)
        ),
        0
      ),
      0
    );

    setDateRange({
      from: updatedFromDate,
      to: updatedToDate,
    });
  };

  // Handle date selection and update dateRange with the selected date and current time
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range || !range.from || !range.to) return;
    updateDateRangeWithTime(range, startTime, endTime);
  };

  // Handle time changes and immediately apply the new time to the selected date range
  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStart: boolean
  ) => {
    const newTime = e.target.value;
    if (isStart) {
      setStartTime(newTime);
      updateDateRangeWithTime(dateRange, newTime, endTime); // Re-run logic to apply new start time
    } else {
      setEndTime(newTime);
      updateDateRangeWithTime(dateRange, startTime, newTime); // Re-run logic to apply new end time
    }
  };

  return (
    <div className="w-full px-4">
      <div className="lg:max-w-[1000px] sm:max-w-[90%] md:max-w-[85%] max-w-[95%] bg-white mt-[3rem] mx-auto rounded-lg py-6 pr-6">
        <div className="flex items-center flex-wrap gap-6 md:gap-0 justify-around">
          <div className="lg:divide-x-2 flex gap-6 md:gap-0 flex-wrap justify-center">
            <div className="flex flex-col relative gap-4 px-5 sm:px-10 xl:mb-0 mb-6">
              <span className="font-semibold">Locations</span>

              <Select onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <div className="flex gap-4 items-center">
                    <SelectValue
                      placeholder="Select Location"
                      className="text-sm font-light "
                    />
                    <FaChevronDown />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cities in Montenegro</SelectLabel>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-4 sm:px-10 px-5  xl:mb-0 mb-6">
              <span className="font-semibold ">Pickup and Return Date</span>
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
                            value={startTime}
                            onChange={(e) => handleTimeChange(e, true)}
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
                            value={endTime}
                            onChange={(e) => handleTimeChange(e, false)}
                            className="pl-8"
                          />
                          <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <Button
            className="flex-1 py-6 ml-6"
            onClick={() => {
              console.log(dateRange, selectedCity);
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Search;
