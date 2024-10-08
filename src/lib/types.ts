import { DateRange } from "react-day-picker";

export interface Car {
  id: number;
  make: string;
  model: string;
  type: string;
  year: number;
  price_per_day: string;
  description: string;
  images: string;
  seating_capacity: number;
  transmission: string;
  fuel_capacity: string;
  fuel_type: string;
  is_available: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_admin: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface Testimonial {
  imgSrc: string;
  name: string;
  location: string;
  quote: string;
}

export interface Review {
  id: number;
  user_id: number;
  vehicle_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
}

export interface DateTimeRange extends DateRange {
  startTime?: string;
  endTime?: string;
}

export interface FilterParams {
  type?: string[];
  seating_capacity?: string[];
  make?: string[];
  max_price?: number;
  is_available?: boolean;
}

export interface DatePickerProps {
  dateRange: DateTimeRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateTimeRange | undefined>>;
  mode: "search" | "rent";
  showTimeSelect?: boolean;
  onSubmit?: (data: {
    dateRange: DateTimeRange | undefined;
    selectedCity: string | undefined;
  }) => void;
  submitButtonText?: string;
  price?: string;
}
