import { LoginForm } from "@/components/forms/loginForm";
import React from "react";

const page = async () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default page;
