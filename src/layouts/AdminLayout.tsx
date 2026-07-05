import { Outlet, NavLink } from "react-router-dom";
import {
  Users,
  Tag,
  Building2,
  BarChart3,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.scss";
import "./admin-sidebar.scss";

const menuItems = [
  { icon: <Users size={18} />, label: "Quản lý tài khoản", path: "/admin/tai-khoan" },
  { icon: <Tag size={18} />, label: "Quản lý loại sự cố", path: "/admin/loai-su-co" },
  { icon: <Building2 size={18} />, label: "Đơn vị tiếp nhận", path: "/admin/don-vi" },
  { icon: <BarChart3 size={18} />, label: "Thống kê hệ thống", path: "/admin/thong-ke" },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-layout__sidebar">
        <div className="admin-sidebar__header">
          <ShieldCheck size={22} className="admin-sidebar__logo-icon" />
          <span className="admin-sidebar__logo-text">Admin Panel</span>
        </div>
        <nav className="admin-sidebar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-sidebar__item ${isActive ? "admin-sidebar__item--active" : ""}`
              }
            >
              <span className="admin-sidebar__item-icon">{item.icon}</span>
              <span className="admin-sidebar__item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div 
            className="admin-sidebar__item" 
            onClick={handleLogout}
            style={{ cursor: "pointer", marginTop: "auto", marginBottom: "20px", color: "#ef4444" }}
        >
          <span className="admin-sidebar__item-icon"><LogOut size={18} /></span>
          <span className="admin-sidebar__item-label">Đăng xuất</span>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
