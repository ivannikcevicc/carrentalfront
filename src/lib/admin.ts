import axios from "axios";
import { getSession } from "./auth";
import { User, Role } from "./adminTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lucic.tech/api";
const USERS_URL = "/admin/users";

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
