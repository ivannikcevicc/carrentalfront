"use client";

import { ReactNode } from "react";
import AdminLTEProvider from "@/components/admin/AdminLTEProvider";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => (
  <AdminLTEProvider>
    <div className="wrapper">
      <AdminNavbar />
      <AdminSidebar />
      <div className="content-wrapper">
        <div className="content">{children}</div>
      </div>
      <footer className="main-footer">
        <strong>Copyright &copy; 2024 EasyDrive.</strong> All rights reserved.
      </footer>
    </div>
  </AdminLTEProvider>
);

export default AdminLayout;
