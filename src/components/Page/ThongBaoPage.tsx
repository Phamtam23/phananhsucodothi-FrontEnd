import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useThongBao } from "../../hooks/thongbao/useThongBao";
import Pagination from "./Pagination";
import { Bell, Check, Info } from "lucide-react";
import "./ThongBaoPage.scss";

const ThongBaoPage = () => {
    const { data, loading, error, page, setPage, unreadCount, markAsRead, markAllAsRead } = useThongBao(0, 10);
    const [selectedThongBao, setSelectedThongBao] = useState<any>(null);

    const handleChiTiet = (tb: any) => {
        setSelectedThongBao(tb);
        if (!tb.daDoc) {
            markAsRead(tb.maThongBao);
        }
    };

    const dongChiTiet = () => {
        setSelectedThongBao(null);
    };

    if (error) {
        return <div className="thong-bao-error">{error}</div>;
    }

    return (
        <div className="thong-bao-page">
            <header className="thong-bao-header">
                <div className="title-area">
                    <Bell className="icon" size={24} />
                    <h2>Thông báo của bạn</h2>
                    {unreadCount > 0 && <span className="badge">{unreadCount} mới</span>}
                </div>
                {unreadCount > 0 && (
                    <button type="button" className="mark-all-btn" onClick={markAllAsRead}>
                        <Check size={16} /> Đánh dấu đã đọc tất cả
                    </button>
                )}
            </header>

            <div className="thong-bao-content">
                {loading && !data ? (
                    <div className="loading-state">Đang tải thông báo...</div>
                ) : data?.content.length === 0 ? (
                    <div className="empty-state">
                        <Info size={40} className="icon-empty" />
                        <p>Bạn chưa có thông báo nào.</p>
                    </div>
                ) : (
                    <div className="thong-bao-list">
                        {data?.content.map((tb) => (
                            <div 
                                key={tb.maThongBao} 
                                className={`thong-bao-item ${!tb.daDoc ? "unread" : ""}`}
                                onClick={() => handleChiTiet(tb)}
                            >
                                <div className="tb-icon">
                                    <Bell size={20} />
                                </div>
                                <div className="tb-details">
                                    <h3 className="tb-title">{tb.tieuDe}</h3>
                                    <p className="tb-preview">{tb.noiDung}</p>
                                    <span className="tb-time">
                                        {tb.thoiGianTao 
                                            ? formatDistanceToNow(new Date(tb.thoiGianTao), { addSuffix: true, locale: vi }) 
                                            : "Vừa xong"}
                                    </span>
                                </div>
                                {!tb.daDoc && <div className="unread-dot"></div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!loading && data && data.pagination.totalPages > 1 && (
                <div className="thong-bao-pagination">
                    <Pagination 
                        currentPage={data.pagination.page}
                        totalPages={data.pagination.totalPages}
                        totalElements={data.pagination.totalElements}
                        pageSize={data.pagination.size}
                        onPageChange={setPage}
                    />
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

export default ThongBaoPage;
