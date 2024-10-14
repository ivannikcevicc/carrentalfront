"use client";

import { LoginForm } from "@/components/forms/loginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (session) {
        toast.error("You are already logged in.");
        router.replace("/");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
