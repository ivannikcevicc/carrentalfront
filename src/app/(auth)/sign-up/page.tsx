"use client";

import { RegisterForm } from "@/components/forms/registerForm";
import React, { useEffect, useState } from "react";

const Page = () => {
  //Hydration errors
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <div className="w-full h-screen flex items-center justify-center">
          <RegisterForm />
        </div>
      ) : null}
    </>
  );
};

export default Page;
