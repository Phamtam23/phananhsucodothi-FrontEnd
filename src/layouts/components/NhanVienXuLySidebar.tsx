import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  FileCheck,
  History,
  FileText,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../components/Sidebar/Sidebar.scss";

const menuItems = [
  {
    icon: <Wrench size={18} />,
    label: "XỬ LÝ SỰ CỐ",
    path: "/nhanvienxuly/xu-ly",
  },
  {
    icon: <FileText size={18} />,
    label: "XEM NỘI DUNG CHỈ ĐẠO",
    path: "/nhanvienxuly/chi-dao",
  },
  {
    icon: <FileCheck size={18} />,
    label: "ĐĂNG KẾT QUẢ",
    path: "/nhanvienxuly/dang-ket-qua",
  },
  {
    icon: <History size={18} />,
    label: "LỊCH SỬ THỰC HIỆN",
    path: "/nhanvienxuly/lich-su",
  },
];

const NhanVienXuLySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <div
              key={index}
              className={`sidebar__item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <div 
          className="sidebar__item" 
          onClick={handleLogout}
          style={{ cursor: "pointer", color: "#ef4444" }}
        >
          <span className="sidebar__icon"><LogOut size={18} /></span>
          <span className="sidebar__label">ĐĂNG XUẤT</span>
        </div>
      </div>
    </div>
  );
};

export default NhanVienXuLySidebar;
