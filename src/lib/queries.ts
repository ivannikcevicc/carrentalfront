import { get } from "@/lib/httpClient";
import { Car } from "@/lib/types";

export async function getVehicles() {
  try {
    const result = await get("/vehicles");
    //@ts-expect-error    aaa

    return result.data as Car[];
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    throw error;
  }
}

export async function getVehicle(id: string) {
  try {
    const result = await get(`/vehicles/${id}`);

    return result as Car;
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    throw error;
  }
}
