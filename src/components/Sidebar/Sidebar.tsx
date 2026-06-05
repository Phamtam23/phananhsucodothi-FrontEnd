import {
  LayoutDashboard,
  ClipboardList,
  Gavel,
  FileCheck,
  History,
  Plus,
  HelpCircle,
  LogOut,
  Landmark,
  Map as MapIcon,
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
        icon: <FileCheck size={20} />,
        label: "KIỂM DUYỆT SỰ CỐ",
        path: "/nhanvien/kiem-duyet",
      },
      {
        icon: <ClipboardList size={20} />,
        label: "PHÂN CÔNG PHÂN LOẠI",
        path: "/nhanvien/phan-cong/phan-loai",
      },
      {
        icon: <FileCheck size={20} />,
        label: "LICH SỬ KIỂM DUYỆT",
        path: "/nhanvien/lich-su/kiem-duyet",
      },
      {
        icon: <MapIcon size={20} />,
        label: "BẢN ĐỒ SỰ CỐ",
        path: "/nhanvien/ban-do",
      }
    ];
  } else if (isTruongDonVi) {
    menuItems = [
      {
        icon: <Gavel size={20} />,
        label: "XÁC MINH PHẢN ÁNH",
        path: "/truongdonvi/xac-minh",
      },
      {
        icon: <FileCheck size={20} />,
        label: "THỐNG KÊ ĐƠN VỊ",
        path: "/truongdonvi/thong-ke",
      },
      {
        icon: <MapIcon size={20} />,
        label: "BẢN ĐỒ SỰ CỐ",
        path: "/truongdonvi/ban-do",
      }
    ];
  } else {
    // Default/Fallback
    menuItems = [
      {
        icon: <LayoutDashboard size={20} />,
        label: "DASHBOARD",
        path: "/",
      },
      {
        icon: <ClipboardList size={20} />,
        label: "DANH SÁCH TỔNG",
        path: "/suco/lich-su",
      },
      {
        icon: <History size={20} />,
        label: "LỊCH SỬ HỆ THỐNG",
        path: "/suco/lich-su",
      },
    ];
  }

  return (
    <div className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-icon">
          <Landmark size={20} />
        </div>
        <div className="brand-text">
          <span className="brand-title">PASC</span>
          <span className="brand-subtitle">ĐÀ NẴNG</span>
        </div>
      </div>

      <div className="sidebar__menu">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path) && item.path !== "/" || location.pathname === item.path;
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

      <div className="sidebar__bottom">
        <button className="sidebar__button" onClick={() => navigate("/suco/create")}>
          <Plus size={18} />
          <span>TẠO BÁO CÁO MỚI</span>
        </button>

        <div className="help-link">
          <HelpCircle size={18} />
          <span>Trợ giúp</span>
        </div>

        <div className="logout-link" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;