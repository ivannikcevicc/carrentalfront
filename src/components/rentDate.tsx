import * as React from "react";
import {
  format,
  addDays,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { City } from "country-state-city";
import { ICity } from "country-state-city";

const MONTENEGRO_COUNTRY_CODE = "ME";

interface RentDateProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  selectedCity: string | undefined;
  setSelectedCity: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const RentDate: React.FC<RentDateProps> = ({
  dateRange,
  setDateRange,
  selectedCity,
  setSelectedCity,
}) => {
  const [cities, setCities] = React.useState<ICity[]>([]);

  // Format date range for display
  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "LLL dd, y")} - ${format(
        dateRange.to,
        "LLL dd, y"
      )}`;
    }
    return "Pick a date range";
  };

  React.useEffect(() => {
    const montenegroCities = City.getCitiesOfCountry(MONTENEGRO_COUNTRY_CODE);
    if (montenegroCities) {
      setCities(montenegroCities);
    } else {
      setCities([]);
    }
  }, []);

  // Handle date selection
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) return;

    let { from, to } = range;

    // If only 'from' is selected
    if (from && !to) {
      setDateRange({ from: startOfDay(from), to: endOfDay(addDays(from, 1)) });
    }
    // If both 'from' and 'to' are selected
    else if (from && to) {
      // Ensure 'from' is always before 'to'
      if (isBefore(to, from)) {
        [from, to] = [to, from];
      }
      // Ensure minimum 1-day range
      if (isBefore(to, addDays(from, 1))) {
        to = endOfDay(addDays(from, 1));
      }
      setDateRange({ from: startOfDay(from), to: endOfDay(to) });
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
                      className="text-sm font-light"
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
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentDate;
