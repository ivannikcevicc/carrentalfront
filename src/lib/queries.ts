import { get } from "@/lib/httpClient";
import { Car } from "@/lib/types";

export async function getVehicles(): Promise<Car[]> {
  try {
    return await get<Car[]>("/vehicles");
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    throw error;
  }
}
