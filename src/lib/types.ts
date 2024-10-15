import { DateRange } from "react-day-picker";
import { Role } from "./adminTypes";

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
  avatar: string | null;
  email_verified_at: string;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
}
export type UpdateUserData = {
  name: string;
  email: string;
  avatar?: File;
};
export type LoggedUserData = {
  name: string;
  email: string;
  avatar?: string | null;
};

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
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface DatePickerProps {
  dateRange: DateTimeRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateTimeRange | undefined>>;
  mode: "search" | "rent";
  showTimeSelect?: boolean;
  onSubmit?: (data: { dateRange: DateTimeRange | undefined }) => void;
  submitButtonText?: string;
  price?: string;
  carId?: number | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface FavoriteResponse {
  current_page: number;
  data: Car[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Reservation {
  id: number;
  user_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: User;
  vehicle: Car;
}

export interface ReviewOverview {
  average_rating: number;
  total_reviews: number;
  stars: {
    "1_star": number;
    "2_stars": number;
    "3_stars": number;
    "4_stars": number;
    "5_stars": number;
  };
}

export interface UnavailableDatesResponse {
  unavailable_dates: string[];
}
