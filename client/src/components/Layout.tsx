import { Package } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/products" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Package size={18} />
            </span>
            Product Management
          </Link>
          <nav aria-label="Main">
            <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Products
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
