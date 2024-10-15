"use server";

import { cookies } from "next/headers";
import { Session, User } from "@/lib/types";
import { get, post } from "@/lib/httpClient";
import axios from "axios";

export async function login(
  email: string,
  password: string
): Promise<Session | null> {
  try {
    const data = await post<{
      user: User;
      access_token: string;
    }>("/login", { email, password });

    const session: Session = {
      user: data.user,
      token: data.access_token,
    };

    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Also store in localStorage for client-side access
    if (typeof window !== "undefined") {
      localStorage.setItem("session", JSON.stringify(session));
    }

    return session;
  } catch (error) {
    console.error("Failed to login:", error);
    return null;
  }
}

interface RegisterErrors {
  [key: string]: string[];
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<Session | RegisterErrors> {
  try {
    const data = await post<{
      user: User;
      access_token: string;
    }>("/register", userData);

    const session: Session = {
      user: data.user,
      token: data.access_token,
    };

    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return session;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessages = error.response.data.errors as RegisterErrors;
      return errorMessages;
    }
    return { general: ["An unexpected error occurred."] };
  }
}

export async function logout() {
  try {
    // Make a POST request to the logout endpoint
    await post("/logout");
  } catch (error) {
    console.error("Failed to logout:", error);
  } finally {
    // Clear the session cookie
    cookies().set("session", "", { expires: new Date(0) });
  }
}
export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie);
  } catch (error) {
    console.error("Failed to parse session:", error);
    return null;
  }
}

export async function getUserInfo(): Promise<{
  name: string;
  email: string;
  avatar: string | null;
} | null> {
  // Check if we're in a server context
  if (typeof window === "undefined") {
    try {
      const cookieStore = cookies();
      const sessionCookie = cookieStore.get("session");
      if (!sessionCookie) return null;

      const session = JSON.parse(sessionCookie.value);
      // Here you might want to verify the session or make an API call
      // For now, we'll just return the user info from the session
      return {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.avatar
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${session.user.avatar}`
          : null,
      };
    } catch (error) {
      console.error("Failed to get user info:", error);
      return null;
    }
  } else {
    // Client-side, return null or handle differently
    return null;
  }
}

export async function getUser() {
  try {
    const response = await get("/user");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Failed to get user info:", error);
    return null;
  }
}
