import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? "active" : "";
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
            <li className="nav-item">
              <Link
                href="/admin/vehicles"
                className={`nav-link ${isActive("/admin/vehicles")}`}
              >
                <i className="nav-icon fas fa-car"></i>
                <p>Vehicles</p>
              </Link>
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
