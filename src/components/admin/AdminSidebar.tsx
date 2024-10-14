import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [vehiclesOpen, setVehiclesOpen] = useState(false);

  const isActive = (path) => {
    return pathname === path ? "text-blue-500 font-bold" : "";
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link href="/admin/dashboard" className="brand-link">
        <img
          src="/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">EasyRide Admin</span>
      </Link>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User"
            />
          </div>
          <div className="info">
            <a href="#" className="d-block">
              Admin User
            </a>
          </div>
        </div>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            <li className="nav-item">
              <Link
                href="/admin/dashboard"
                className={`nav-link ${isActive("/admin/dashboard")}`}
              >
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="">
              <button
                onClick={() => setVehiclesOpen(!vehiclesOpen)}
                className="flex items-center justify-between w-full py-2 px-4 rounded text-[#c2c7d0]"
              >
                Vehicles
                {vehiclesOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {vehiclesOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <Link
                      href="/admin/vehicles"
                      className={`block py-2 px-4 rounded hover:bg-gray-700 ${isActive(
                        "/admin/vehicles"
                      )}`}
                    >
                      All Vehicles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/vehicles/kanban"
                      className={`block py-2 px-4 rounded hover:bg-gray-700 ${isActive(
                        "/admin/vehicles/kanban"
                      )}`}
                    >
                      Kanban
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link
                href="/admin/users"
                className={`nav-link ${isActive("/admin/users")}`}
              >
                <i className="nav-icon fas fa-users"></i>
                <p>Users</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/admin/reservations"
                className={`nav-link ${isActive("/admin/reservations")}`}
              >
                <i className="nav-icon fas fa-calendar-alt"></i>
                <p>Reservations</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/admin/maintenance"
                className={`nav-link ${isActive("/admin/maintenance")}`}
              >
                <i className="nav-icon fas fa-tools"></i>
                <p>Maintenance</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/admin/reports"
                className={`nav-link ${isActive("/admin/reports")}`}
              >
                <i className="nav-icon fas fa-chart-bar"></i>
                <p>Reports</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/admin/settings"
                className={`nav-link ${isActive("/admin/settings")}`}
              >
                <i className="nav-icon fas fa-cog"></i>
                <p>Settings</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
