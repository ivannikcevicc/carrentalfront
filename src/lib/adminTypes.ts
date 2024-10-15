export interface Vehicle {
  id: number;
  make: string;
  model: string;
  type: string;
  year: number;
  price_per_day: number;
  description: string;
  images: string[];
  seating_capacity: number;
  transmission: "Manual" | "Automatic";
  fuel_capacity: number;
  fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  status:
    | "Available"
    | "Reserved"
    | "In Use"
    | "Under Maintenance"
    | "Under Repair";
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  is_admin?: boolean;
  is_blocked?: boolean;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface Reservation {
  id: number;
  user: { name: string };
  vehicle: { name: string };
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}
