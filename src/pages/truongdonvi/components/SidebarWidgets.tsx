import { Map as MapIcon, Info, HelpCircle } from "lucide-react";

export interface SidebarWidgetsProps {
    pendingCount: number;
    acceptedCount: number;
}

export const SidebarWidgets = ({ pendingCount, acceptedCount }: SidebarWidgetsProps) => {
    return (
        <div className="xac-minh-sidebar">
            <div className="xac-minh-widget xac-minh-map-widget">
                <div className="xac-minh-widget-header">
                    <MapIcon size={16} className="text-cam" />
                    <span className="xac-minh-widget-label">VỊ TRÍ ĐIỂM NÓNG</span>
                </div>
                <div className="xac-minh-map-placeholder" style={{ background: '#374151', backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    {/* Simulated dark map background */}
                </div>
                <div className="xac-minh-widget-footer" style={{ textAlign: 'center' }}>
                    <p>Cụm phản ánh hạ tầng Hải Châu</p>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Gia tăng 12% so với tuần trước</span>
                </div>
            </div>

            <div className="xac-minh-widget xac-minh-stats-widget">
                <span className="xac-minh-widget-label">TRẠNG THÁI XỬ LÝ</span>
                
                <div className="xac-minh-stat-item" style={{ marginTop: '24px' }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>Hiệu suất Phản hồi</span>
                    <strong className="text-cam" style={{ fontSize: '24px' }}>94%</strong>
                </div>
                <div className="xac-minh-stat-bar">
                    <div className="xac-minh-stat-progress bg-cam" style={{ width: '94%' }}></div>
                </div>

                <div className="xac-minh-stat-columns" style={{ display: 'flex', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, marginBottom: '4px' }}>TỔNG SỐ</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>1,284</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', color: '#ea580c', fontWeight: 700, marginBottom: '4px' }}>ĐÃ XONG</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#ea580c' }}>1,102</div>
                    </div>
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
