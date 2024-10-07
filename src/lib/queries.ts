import { get, post } from "@/lib/httpClient";
import { Car, FilterParams, Review } from "@/lib/types";

export async function getVehicles(filters: FilterParams = {}) {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "is_available") {
          queryParams.append(key, value ? "1" : "0");
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    // Ensure is_available is always included in the query
    if (!queryParams.has("is_available")) {
      queryParams.append("is_available", "0");
    }

    const result = await get(`/vehicles?${queryParams.toString()}`);

    //@ts-expect-error temporary
    return result.data as Car[];
  } catch (error) {
    console.error("Failed to fetch vehicles:", error.response.data.errors);
    throw error;
  }
}

export async function getVehicle(id: string) {
  try {
    const result = await get(`/vehicles/${id}`);

    return result as Car;
  } catch (error) {
    console.error("Failed to fetch vehicles:", error.response.data.errors);
    throw error;
  }
}

export async function getReviewsByCarId(id: string) {
  try {
    const result = await get(`/reviews?vehicle_id=${id}`);

    return result as Review[];
  } catch (error) {
    console.error("Failed to fetch vehicles:", error.response.data.errors);
    throw error;
  }
}

export async function createReview(data: {
  vehicle_id: number;
  rating: number;
  comment: string;
  // user: {
  //   name: string;
  //   email: string;
  // };
}) {
  try {
    const result = await post(`/reviews`, data);
    return result;
  } catch (error) {
    console.error("Failed to create a review:", error.response.data.errors);
    throw error;
  }
}
