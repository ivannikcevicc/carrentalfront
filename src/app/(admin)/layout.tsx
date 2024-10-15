"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLTEProvider from "@/components/admin/AdminLTEProvider";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getUser } from "@/lib/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getUser();
        console.log(user);
        if (!user) {
          router.push("/login");
        } else if (user.roles.length < 1) {
          router.push("/");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user session", error);
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <AdminLTEProvider>
      <div className="wrapper">
        <AdminNavbar />
        <AdminSidebar />
        <div className="content-wrapper">
          <div className="content">{children}</div>
        </div>
        <footer className="main-footer text-center">
          <strong>Copyright &copy; 2024 EasyDrive.</strong> All rights reserved.
        </footer>
      </div>
    </AdminLTEProvider>
  );
};

export default AdminLayout;
