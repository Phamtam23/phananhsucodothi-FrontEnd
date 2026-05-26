import { Bell, Settings } from "lucide-react";
import "./InternalHeader.scss";

const InternalHeader = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const hoTen = user?.hoTen || "Officer Nguyen";
  const donVi = user?.role === "R_NVXULY" ? "PROCESSING UNIT" : 
                user?.role === "R_TXULY" ? "UNIT HEAD" : "DEPARTMENT";

  return (
    <header className="internal-header">
      <div className="internal-header__search">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Tìm mã sự cố hoặc tên công việc..." />
      </div>

      <div className="internal-header__actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <button className="icon-btn">
          <Settings size={20} />
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{hoTen}</span>
            <span className="user-role">{donVi}</span>
          </div>
          <div className="user-avatar">
            <img src={user?.anhDaiDien || "https://ui-avatars.com/api/?name=" + hoTen + "&background=random"} alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default InternalHeader;
