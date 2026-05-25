import {
  LayoutDashboard,
  ClipboardList,
  Gavel,
  FileCheck,
  History,
  Plus,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  // Parse user from localStorage to determine role
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || "";
  
  const isDieuPhoi = role === "R_DIEUPHOI";
  const isTruongDonVi = role === "R_TXULY";

  let menuItems = [];

  if (isDieuPhoi) {
    menuItems = [
      {
        icon: <FileCheck size={18} />,
        label: "KIỂM DUYỆT SỰ CỐ",
        path: "/nhanvien/kiem-duyet",
      },
      {
        icon: <ClipboardList size={18} />,
        label: "PHÂN CÔNG PHÂN LOẠI",
        path: "/nhanvien/phan-cong/phan-loai",
      },
       {
        icon: <FileCheck size={18} />,
        label: "LICH SỬ KIỂM DUYỆT",
        path: "/nhanvien/lich-su/kiem-duyet",
      },
    ];
  } else if (isTruongDonVi) {
    menuItems = [
      {
        icon: <Gavel size={18} />,
        label: "XÁC MINH PHẢN ÁNH",
        path: "/truongdonvi/xac-minh",
      },
    ];
  } else {
    // Default/Fallback
    menuItems = [
      {
        icon: <LayoutDashboard size={18} />,
        label: "DASHBOARD",
        path: "/",
      },
      {
        icon: <ClipboardList size={18} />,
        label: "DANH SÁCH TỔNG",
        path: "/suco/lich-su",
      },
      {
        icon: <History size={18} />,
        label: "LỊCH SỬ HỆ THỐNG",
        path: "/suco/lich-su",
      },
    ];
  }

  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path) && item.path !== "/" || location.pathname === item.path;
          return (
            <div
              key={index}
              className={`sidebar__item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <button className="sidebar__button" onClick={() => navigate("/suco/create")}>
        <Plus size={16} />
        <span>TẠO BÁO CÁO MỚI</span>
      </button>

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

export default Sidebar;