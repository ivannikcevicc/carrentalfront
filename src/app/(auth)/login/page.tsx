"use client";

import { LoginForm } from "@/components/forms/loginForm";
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
          <LoginForm />
        </div>
      ) : null}
    </>
  );
};

export default Page;
