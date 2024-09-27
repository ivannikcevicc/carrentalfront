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
