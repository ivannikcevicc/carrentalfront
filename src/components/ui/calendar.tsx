import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  DayPicker,
  DayPickerProps,
  DayPickerDefaultProps,
  DayPickerSingleProps,
  DayPickerMultipleProps,
  DayPickerRangeProps,
} from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getUnavailableDates } from "@/lib/queries";

type UnavailableDatesResponse = {
  unavailable_dates: string[];
};

type BaseCalendarProps = {
  className?: string;
  classNames?: DayPickerProps["classNames"];
  showOutsideDays?: boolean;
  carId?: number;
};

type CalendarProps =
  | (Omit<DayPickerDefaultProps, "disabled"> & BaseCalendarProps)
  | (Omit<DayPickerSingleProps, "disabled"> & BaseCalendarProps)
  | (Omit<DayPickerMultipleProps, "disabled"> & BaseCalendarProps)
  | (Omit<DayPickerRangeProps, "disabled"> & BaseCalendarProps);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  carId,
  ...props
}: CalendarProps) {
  const [unavailableDates, setUnavailableDates] = React.useState<Date[]>([]);

  React.useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (carId) {
        try {
          const result: UnavailableDatesResponse = await getUnavailableDates(
            carId
          );
          const dates = result.unavailable_dates.map(
            (dateStr: string) => new Date(dateStr)
          );
          setUnavailableDates(dates);
        } catch (error) {
          console.error("Failed to fetch unavailable dates:", error);
        }
      } else {
        setUnavailableDates([]);
      }
    };

    fetchUnavailableDates();
  }, [carId]);

  const disabledDays = React.useCallback(
    (date: Date): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const sixMonthsLater = new Date(today);
      sixMonthsLater.setMonth(today.getMonth() + 6);

      const isUnavailable = carId
        ? unavailableDates.some(
            (unavailableDate) =>
              unavailableDate.toISOString().split("T")[0] ===
              date.toISOString().split("T")[0]
          )
        : false;

      return date < tomorrow || date > sixMonthsLater || isUnavailable;
    },
    [unavailableDates, carId]
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        //eslint-disable-next-line
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        //eslint-disable-next-line
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      disabled={disabledDays}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
