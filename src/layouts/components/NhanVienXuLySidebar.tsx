import {
  Landmark,
  List,
  RefreshCcw,
  BarChart2,
  History,
  Plus,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../components/Sidebar/Sidebar.scss";

const menuItems = [
  {
    icon: <List size={20} />,
    label: "Danh sách phản ánh",
    path: "/nhanvienxuly/xu-ly",
  },
  {
    icon: <RefreshCcw size={20} />,
    label: "Yêu cầu thực hiện lại",
    path: "/nhanvienxuly/chi-dao",
  },
  {
    icon: <BarChart2 size={20} />,
    label: "Báo cáo kết quả",
    path: "/nhanvienxuly/dang-ket-qua",
  },
  {
    icon: <History size={20} />,
    label: "Lịch sử thực hiện",
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
      <div className="sidebar__brand">
        <div className="brand-icon">
          <Landmark size={20} />
        </div>
        <div className="brand-text">
          <span className="brand-title">Civic Gallerist</span>
          <span className="brand-subtitle">URBAN PULSE CIVIC</span>
        </div>
      </div>

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

      <div className="sidebar__bottom">
        <button className="sidebar__button">
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

export default NhanVienXuLySidebar;
