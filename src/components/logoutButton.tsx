"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { logout } from "../../auth";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
