import axios from "axios";
import { getSession } from "./auth";
import { User, Role } from "./adminTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lucic.tech/api";
const DASHBOARD_URL = "/admin/dashboard";
const VEHICLES_URL = "/admin/vehicles";
const USERS_URL = "/admin/users";
const RESERVATIONS_URL = "/admin/reservations";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token) {
      config.headers["Authorization"] = `Bearer ${session.token}`;
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export const fetchDashboardData = async () => {
  try {
    const response = await api.get(DASHBOARD_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const fetchVehicles = async (page = 1, searchTerm = "") => {
  try {
    const response = await api.get(
      `${VEHICLES_URL}?page=${page}&search=${searchTerm}`
    );
    return {
      vehicles: response.data,
    };
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const createVehicle = async (vehicleData: FormData) => {
  try {
    const response = await api.post(VEHICLES_URL, vehicleData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error.response.data;
  }
};

export const updateVehicle = async (id: number, data: FormData) => {
  try {
    console.log(data);
    const response = await api.post(`${VEHICLES_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Failed to update vehicle"
    );
  }
};

export const deleteVehicleImage = async (
  vehicleId: number,
  imageUrl: string
) => {
  const response = await fetch(`/api/admin/vehicles/${vehicleId}/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  return response.json();
};

export const deleteVehicle = async (id) => {
  try {
    await api.delete(`${VEHICLES_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

export const fetchReservations = async (page = 1) => {
  try {
    const response = await api.get(`${RESERVATIONS_URL}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const updateVehicleStatus = async (id, status) => {
  try {
    const response = await api.put(`${VEHICLES_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    throw error;
  }
};

export const fetchUsers = async (search?: string, role?: string) => {
  try {
    const response = await api.get(USERS_URL, {
      params: { search, role },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  try {
    const formattedUserData = {
      ...userData,
      roles: userData.roles
        ? userData.roles.map((role) => role.name)
        : undefined,
    };
    const response = await api.put(`${USERS_URL}/${id}`, formattedUserData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    await api.delete(`${USERS_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, "id">) => {
  try {
    const formattedUserData = {
      ...userData,
      roles: userData.roles.map((role) => role.name),
    };
    const response = await api.post(USERS_URL, formattedUserData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
export const assignRole = async (userId: number, roleId: number) => {
  try {
    const response = await api.post(`${API_URL}/admin/roles/assign`, {
      user_id: userId,
      role_id: roleId,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning role:", error);
    throw error;
  }
};

export const removeRole = async (userId: number, roleId: number) => {
  try {
    const response = await api.post(`${API_URL}/admin/roles/remove`, {
      user_id: userId,
      role_id: roleId,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing role:", error);
    throw error;
  }
};

export const fetchRoles = async () => {
  try {
    const response = await api.get(`${API_URL}/admin/roles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const toggleBlockUser = async (userId: number) => {
  try {
    const response = await api.post(`${USERS_URL}/${userId}/toggleblock`);
    return response.data;
  } catch (error) {
    console.error("Error toggling user block status:", error);
    throw error;
  }
};

export default api;
