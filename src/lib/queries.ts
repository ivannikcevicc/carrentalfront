import { get, post } from "@/lib/httpClient";
import { Car, Review } from "@/lib/types";
import { getSession } from "./auth";

export async function getVehicles() {
  try {
    const result = await get("/vehicles");

    //@ts-expect-error

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

export async function getReviewsByCarId(id: string) {
  try {
    const result = await get(`/reviews?vehicle_id=${id}`);

    return result as Review[];
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
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
    console.error("Failed to create a review:", error);
    throw error;
  }
}
