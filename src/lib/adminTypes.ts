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
