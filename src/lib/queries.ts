import { del, get, post } from "@/lib/httpClient";
import {
  Car,
  FavoriteResponse,
  FilterParams,
  PaginatedResponse,
  Reservation,
  Review,
  ReviewOverview,
  UpdateUserData,
} from "@/lib/types";
import { Session, User } from "@/lib/types";

export async function getVehicles(
  filters: FilterParams = {}
): Promise<PaginatedResponse<Car>> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) =>
            queryParams.append(`${key}[]`, item.toString())
          );
        } else if (key === "is_available") {
          queryParams.append(key, value ? "1" : "0");
        } else if (key === "start_date" || key === "end_date") {
          if (value !== "") {
            queryParams.append(key, value);
          }
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    // Ensure is_available is always included in the query
    if (!queryParams.has("is_available")) {
      queryParams.append("is_available", "0");
    }

    // Remove start_date and end_date if they are null or empty strings
    if (!filters.start_date || filters.start_date === "") {
      queryParams.delete("start_date");
    }
    if (!filters.end_date || filters.end_date === "") {
      queryParams.delete("end_date");
    }

    console.log("Filters:", filters);
    console.log("Query params:", queryParams.toString());

    const response = await get(`/vehicles?${queryParams.toString()}`);
    console.log("Fetched from:", `/vehicles?${queryParams.toString()}`);
    return response as PaginatedResponse<Car>;
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    throw error;
  }
}

export async function getVehicle(id: number) {
  try {
    const result = await get(`/vehicles/${id}`);

    return result as Car;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch vehicle:", error);
    } else {
      console.error("Failed to fetch vehicle:", String(error));
    }
    throw error;
  }
}

export async function getReviewsByCarId(id: number) {
  try {
    const result = await get(`/reviews?vehicle_id=${id}`);

    return result as Review[];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to get reviews:", error);
    } else {
      console.error("Failed to get reviews:", String(error));
    }
    throw error;
  }
}
export async function getReviewsInfoByCarId(id: number) {
  try {
    const result = await get(`/reviews/${id}/overview`);

    return result as ReviewOverview;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to get review info:", error);
    } else {
      console.error("Failed to get review info:", String(error));
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
      console.error("Failed to create review:", error);
    } else {
      console.error("Failed to create review:", String(error));
    }
    throw error;
  }
}

export async function createReservation(data: {
  vehicle_id: number;
  start_date: Date;
  end_date: Date;
}) {
  try {
    const result = await post(`/reservations`, data);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create reservation:", error);
    } else {
      console.error("Failed to create reservation:", String(error));
    }
    throw error;
  }
}

export async function getReservations() {
  try {
    const result = await get(`/reservations`);
    return result as Reservation[];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to get reservations:", error);
    } else {
      console.error("Failed to get reservations:", String(error));
    }
    throw error;
  }
}

export async function deleteReservation(id: number) {
  try {
    const result = await del(`/reservations/${id}`);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to delete reservations:", error);
    } else {
      console.error("Failed to delete reservations:", String(error));
    }
    throw error;
  }
}

export async function updateUser(data: UpdateUserData) {
  try {
    // Create FormData instance
    const formData = new FormData();

    // Append regular fields
    formData.append("name", data.name);
    formData.append("email", data.email);

    // Append avatar file if it exists
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    // Use existing post function with FormData and custom config
    const result = await post<{ user: User }>("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Update the session data
    const sessionData = localStorage.getItem("session");
    if (sessionData) {
      const session: Session = JSON.parse(sessionData);
      session.user = result.user;
      localStorage.setItem("session", JSON.stringify(session));
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to update user:", error);
    } else {
      console.error("Failed to update user:", String(error));
    }
    throw error;
  }
}

export async function getFavoriteVehicles(
  params: { page?: number; per_page?: number } = {}
) {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const result = await get(`/favorites?${queryParams.toString()}`);
    return result as FavoriteResponse;
  } catch (error) {
    console.error("Failed to get favorites:", error);
    throw error;
  }
}

export async function toggleFavorite(carId: number) {
  try {
    const result = await post(`/favorites/${carId}`);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to toggle favorite:", error);
    } else {
      console.error("Failed to toggle favorite:", String(error));
    }
    throw error;
  }
}
