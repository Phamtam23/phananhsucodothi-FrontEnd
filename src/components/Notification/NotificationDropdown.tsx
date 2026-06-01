import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Bell, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThongBao } from "../../hooks/thongbao/useThongBao";
import "./NotificationDropdown.scss";

interface NotificationDropdownProps {
  buttonClassName?: string;
  badgeClassName?: string;
  isInternal?: boolean;
}

const NotificationDropdown = ({ buttonClassName, badgeClassName, isInternal }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThongBao, setSelectedThongBao] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { data, loading, unreadCount, markAsRead, markAllAsRead } = useThongBao(0, 5); // Fetch only 5 for dropdown

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleChiTiet = (tb: any) => {
    setSelectedThongBao(tb);
    setIsOpen(false);
    if (!tb.daDoc) {
      markAsRead(tb.maThongBao);
    }
  };

  const dongChiTiet = () => {
    setSelectedThongBao(null);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (isInternal) {
      if (user?.role === "R_NVXULY") navigate("/nhanvienxuly/thong-bao");
      else if (user?.role === "R_TXULY") navigate("/truongdonvi/thong-bao");
      else if (user?.role === "R_NVDIEUPHOI") navigate("/nhanvien/thong-bao");
      else if (user?.role === "R_ADMIN") navigate("/admin/thong-bao");
      else navigate("/thong-bao");
    } else {
      navigate("/thong-bao");
    }
  };

  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <button className={buttonClassName || "icon-btn"} onClick={handleToggle}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={badgeClassName || "badge"}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="nd-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <button className="nd-mark-all" onClick={markAllAsRead}>
                <Check size={14} /> Đánh dấu đã đọc
              </button>
            )}
          </div>
          <div className="nd-body">
            {loading ? (
              <div className="nd-empty">Đang tải...</div>
            ) : data?.content.length === 0 ? (
              <div className="nd-empty">Không có thông báo nào</div>
            ) : (
              data?.content.map((tb) => (
                <div 
                  key={tb.maThongBao} 
                  className={`nd-item ${!tb.daDoc ? "unread" : ""}`}
                  onClick={() => handleChiTiet(tb)}
                >
                  <div className="nd-item-icon">
                    <Bell size={16} />
                  </div>
                  <div className="nd-item-content">
                    <div className="nd-item-title">{tb.tieuDe}</div>
                    <div className="nd-item-time">
                      {tb.thoiGianTao 
                        ? formatDistanceToNow(new Date(tb.thoiGianTao), { addSuffix: true, locale: vi }) 
                        : "Vừa xong"}
                    </div>
                  </div>
                  {!tb.daDoc && <div className="nd-unread-dot"></div>}
                </div>
              ))
            )}
          </div>
          <div className="nd-footer" onClick={handleViewAll}>
            Xem tất cả thông báo
          </div>
        </div>
      )}

      {/* Modal Chi Tiết */}
      {selectedThongBao && (
        <div className="modal-thong-bao-nen" onClick={dongChiTiet}>
            <div className="modal-thong-bao-hop" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Chi tiết thông báo</h3>
                    <button type="button" className="close-btn" onClick={dongChiTiet}>✕</button>
                </div>
                <div className="modal-body">
                    <h4 className="tb-modal-title">{selectedThongBao.tieuDe}</h4>
                    <span className="tb-modal-time">
                        {selectedThongBao.thoiGianTao 
                            ? new Date(selectedThongBao.thoiGianTao).toLocaleString("vi-VN") 
                            : "Vừa xong"}
                    </span>
                    <div className="tb-modal-content">
                        {selectedThongBao.noiDung}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-ok" onClick={dongChiTiet}>Đóng</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
