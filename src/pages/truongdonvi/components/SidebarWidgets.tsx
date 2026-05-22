import { Map as MapIcon, Info, HelpCircle } from "lucide-react";

export interface SidebarWidgetsProps {
    pendingCount: number;
    acceptedCount: number;
}

export const SidebarWidgets = ({ pendingCount, acceptedCount }: SidebarWidgetsProps) => {
    return (
        <div className="xac-minh-sidebar">
            <div className="xac-minh-widget xac-minh-map-widget">
                <div className="xac-minh-map-placeholder">
                    <MapIcon size={48} className="text-xam" />
                </div>
                <div className="xac-minh-widget-footer">
                    <span className="xac-minh-widget-label">VỊ TRÍ ĐIỂM NÓNG</span>
                    <p>Cụm phản ánh hạ tầng Quận 1</p>
                </div>
            </div>

            <div className="xac-minh-widget xac-minh-stats-widget">
                <span className="xac-minh-widget-label">TRẠNG THÁI XỬ LÝ</span>
                <div className="xac-minh-stat-item">
                    <span>Đang chờ xác minh</span>
                    <strong className="text-cam">{pendingCount}</strong>
                </div>
                <div className="xac-minh-stat-bar">
                    <div className="xac-minh-stat-progress bg-cam" style={{ width: '30%' }}></div>
                </div>
                <div className="xac-minh-stat-item mt-4">
                    <span>Đã tiếp nhận hôm nay</span>
                    <strong>{acceptedCount}</strong>
                </div>
                <div className="xac-minh-stat-bar">
                    <div className="xac-minh-stat-progress bg-den" style={{ width: '80%' }}></div>
                </div>
            </div>

            <div className="xac-minh-widget xac-minh-info-widget">
                <div className="xac-minh-info-header">
                    <Info size={16} className="text-cam" />
                    <span className="xac-minh-widget-label text-cam">LƯU Ý NGHIỆP VỤ</span>
                </div>
                <p>
                    Đơn vị có tối đa 30 phút để xác minh tính chính xác của phản ánh kể từ khi được 
                    điều chuyển. Sau thời gian này, hệ thống sẽ tự động nhắc nhở cấp quản lý trực tiếp.
                </p>
                <button className="xac-minh-help-btn">
                    <HelpCircle size={24} />
                </button>
            </div>
        </div>
    );
};
