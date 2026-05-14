
import {
  LayoutDashboard,
  ClipboardList,
  Gavel,
  FileCheck,
  History,
  Plus,
} from "lucide-react";

import "./Sidebar.scss";

const menuItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "DASHBOARD",
    active: false,
  },
  {
    icon: <ClipboardList size={18} />,
    label: "DANH SÁCH TỔNG",
    active: false,
  },
  {
    icon: <Gavel size={18} />,
    label: "HỖ TRỢ XỬ LÝ",
    active: true,
  },
  {
    icon: <FileCheck size={18} />,
    label: "KIỂM DUYỆT KẾT QUẢ",
    active: false,
  },
  {
    icon: <History size={18} />,
    label: "LỊCH SỬ HỆ THỐNG",
    active: false,
  },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`sidebar__item ${item.active ? "active" : ""}`}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </div>
        ))}
      </div>

      <button className="sidebar__button">
        <Plus size={16} />
        <span>TẠO BÁO CÁO MỚI</span>
      </button>
    </div>
  );
};

export default Sidebar;