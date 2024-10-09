import { get, post } from "@/lib/httpClient";
import { Car, FilterParams, Review } from "@/lib/types";

export async function getVehicles(filters: FilterParams = {}) {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) =>
            queryParams.append(`${key}[]`, item.toString())
          );
        } else if (key === "is_available") {
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

    console.log("Filters:", filters);
    console.log("Query params:", queryParams.toString());

    const result = await get(`/vehicles?${queryParams.toString()}`);
    console.log("Fetched from:", `/vehicles?${queryParams.toString()}`);
    //@ts-expect-error temp
    return result.data as Car[];
  } catch (error) {
    //@ts-expect-error temp
    console.error("Failed to fetch vehicles:", error.response);
    throw error;
  }
}

export async function getVehicle(id: string) {
  try {
    const result = await get(`/vehicles/${id}`);

    return result as Car;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch vehicles:", error.message);
    } else {
      console.error("Failed to fetch vehicles:", String(error));
    }
    throw error;
  }
}

export async function getReviewsByCarId(id: string) {
  try {
    const result = await get(`/reviews?vehicle_id=${id}`);

    return result as Review[];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch vehicles:", error.message);
    } else {
      console.error("Failed to fetch vehicles:", String(error));
    }
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
    if (error instanceof Error) {
      console.error("Failed to fetch vehicles:", error.message);
    } else {
      console.error("Failed to fetch vehicles:", String(error));
    }
    throw error;
  }
}
