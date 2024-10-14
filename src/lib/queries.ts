"use server";
import { del, get, post } from "@/lib/httpClient";
import {
  Car,
  FavoriteResponse,
  FilterParams,
  PaginatedResponse,
  Reservation,
  Review,
  ReviewOverview,
  UnavailableDatesResponse,
} from "@/lib/types";
import { Session, User } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

export async function updateUser(formData: FormData) {
  try {
    // Use existing post function with FormData
    const result = await post<{ user: User }>("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Update the session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");
    if (sessionCookie) {
      const session: Session = JSON.parse(sessionCookie.value);
      session.user = result.user;
      cookieStore.set("session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    // Revalidate the profile page
    revalidatePath("/profile");

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: String(error) };
  }
}

export async function getFavoriteVehicles(
  params: { page?: number; per_page?: number } = {}
): Promise<FavoriteResponse> {
  try {
    // Check if favorites exist in localStorage
    const localFavorites = getLocalFavorites();

    if (localFavorites) {
      console.log("Returning favorites from localStorage");
      return localFavorites;
    }

    // If not in localStorage, fetch from server
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const result = await get(`/favorites?${queryParams.toString()}`);
    const serverFavorites = result as FavoriteResponse;

    // Save to localStorage
    setLocalFavorites(serverFavorites);

    console.log("Fetched favorites from server and saved to localStorage");
    return serverFavorites;
  } catch (error) {
    console.error("Failed to get favorites:", error);
    throw error;
  }
}
export async function toggleFavorite(carId: number) {
  try {
    // Toggle on the server
    const result = await post(`/favorites/${carId}`);

    // Toggle in localStorage
    const localFavorites = getLocalFavorites();
    if (localFavorites) {
      const updatedFavorites = {
        ...localFavorites,
        data: localFavorites.data.some((car) => car.id === carId)
          ? localFavorites.data.filter((car) => car.id !== carId)
          : [...localFavorites.data, { id: carId } as Car],
      };
      setLocalFavorites(updatedFavorites);
    }

    console.log("Toggled favorite on server and in localStorage");
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
const getLocalFavorites = (): FavoriteResponse | null => {
  if (typeof window !== "undefined") {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : null;
  }
  return null;
};

const setLocalFavorites = (favorites: FavoriteResponse) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export async function getUnavailableDates(carId: number) {
  try {
    const result = await get(`/vehicles/${carId}/unvailableDates`);
    return result as UnavailableDatesResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch unavailable dates:", error);
    } else {
      console.error("Failed to fetch unavailable dates:", String(error));
    }
    throw error;
  }
}
