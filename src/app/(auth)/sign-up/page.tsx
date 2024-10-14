"use client";

import { RegisterForm } from "@/components/forms/registerForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

const SignupPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (session) {
        router.replace("/");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default SignupPage;
