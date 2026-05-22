import "./DetailSuco.scss";
import { useParams, useNavigate } from "react-router-dom";
import DetailSuCo from "../../../components/Suco/DetailSuCo";
import DanhSachPhanCong from "../../../components/PhanCong/DanhSachPhanCong";
import { useDetailSuco } from "../../../hooks/suco/useDetailSuco";

const TRANG_THAI_ACCENT: Record<string, string> = {
  CHO_TIEP_NHAN: 'CHỜ TIẾP NHẬN',
  DA_TIEP_NHAN: 'ĐÃ TIẾP NHẬN',
  DANG_XU_LY: 'ĐANG XỬ LÝ',
  DA_HOAN_THANH: 'ĐANG ĐÁNH GIÁ',
  LA_SPAM: 'SPAM',
};

const DetailSucoPage = () => {
    const { maSuCo } = useParams<{ maSuCo: string }>();
    const navigate = useNavigate();
    const { suco, loading, error } = useDetailSuco(maSuCo ?? "");

    if (loading) return <div className="page-loading">Đang tải trang chi tiết...</div>;
    if (error) return <div className="page-error">{error}</div>;
    if (!suco) return <div className="page-empty">Không tìm thấy thông tin phản ánh này.</div>;

    const lat = suco.viDo;
    const lon = suco.kinhDo;

    // OpenStreetMap Embed link centered on lat/lon
    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.003}%2C${lat - 0.002}%2C${lon + 0.003}%2C${lat + 0.002}&layer=mapnik&marker=${lat}%2C${lon}`;
    const mapLargeUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

    const printPage = () => {
        window.print();
    };

    return (
        <div className="suco-detail-page">
            {/* Top Navigation / Back button */}
            <button className="btn-quay-lai" onClick={() => navigate(-1)}>
                <i className="ti ti-arrow-left" /> Quay lại
            </button>

            {/* Page Header */}
            <header className="page-header">
                <div className="header-left">
                    <div className="header-badge-row">
                        <span className={`status-badge status--${suco.trangThai.toLowerCase()}`}>
                            {TRANG_THAI_ACCENT[suco.trangThai] || suco.trangThai}
                        </span>
                        <span className="incident-id">Mã phản ánh #PA-{suco.maSuCo}</span>
                    </div>
                    <h1 className="page-title">Chi tiết phản ánh & Đánh giá</h1>
                    <div className="address-row">
                        <i className="ti ti-map-pin" />
                        <span>{suco.diaDiem}</span>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn-share" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Đã sao chép liên kết chia sẻ phản ánh này!");
                    }}>
                        <i className="ti ti-share" /> Chia sẻ
                    </button>
                    <button className="btn-print" onClick={printPage}>
                        <i className="ti ti-printer" /> In biên nhận
                    </button>
                </div>
            </header>

            {/* Main Layout Grid */}
            <div className="detail-page-layout">
                {/* Left Column - Report details & Assignment list */}
                <main className="detail-page-main">
                    <DetailSuCo maSuCo={maSuCo ?? ""} />
                    
                    <div className="don-vi-xu-ly-section">
                        <div className="section-title-row">
                            <i className="ti ti-briefcase" />
                            <h2>Đơn vị Xử lý</h2>
                        </div>
                        <DanhSachPhanCong maSuCo={maSuCo ?? ""} />
                    </div>
                </main>

                {/* Right Column - Sidebar Widgets */}
                <aside className="detail-page-sidebar">
                    {/* Widget 1: Vị trí sự cố (OSM Interactive Map) */}
                    <div className="sidebar-widget widget-map">
                        <div className="widget-header">
                            <i className="ti ti-map" />
                            <span>Vị trí sự cố</span>
                        </div>
                        <div className="map-container">
                            <iframe
                                title="Bản đồ sự cố"
                                src={mapEmbedUrl}
                                width="100%"
                                height="220"
                                frameBorder="0"
                                style={{ border: 0, borderRadius: '8px' }}
                                allowFullScreen
                            />
                            <a href={mapLargeUrl} target="_blank" rel="noopener noreferrer" className="btn-large-map">
                                Mở bản đồ lớn
                            </a>
                        </div>
                    </div>

                    {/* Widget 2: Lịch trình xử lý (Timeline) */}
                    <div className="sidebar-widget widget-timeline">
                        <div className="widget-header">
                            <i className="ti ti-time" />
                            <span>Lịch trình xử lý</span>
                        </div>
                        
                        <div className="timeline-flow">
                            {suco.trangThai === "DA_HOAN_THANH" && (
                                <div className="timeline-step step-active">
                                    <span className="timeline-dot yellow-dot" />
                                    <div className="timeline-content">
                                        <p className="step-time">HÔM NAY, VỪA XONG</p>
                                        <p className="step-title">Đang chờ đánh giá</p>
                                        <p className="step-desc">Phản ánh đã được xử lý hoàn tất, đang chờ công dân gửi ý kiến phản hồi đánh giá.</p>
                                    </div>
                                </div>
                            )}

                            {(suco.trangThai === "DANG_XU_LY" || suco.trangThai === "DA_HOAN_THANH") && (
                                <div className={`timeline-step ${suco.trangThai === "DANG_XU_LY" ? 'step-active' : 'step-done'}`}>
                                    <span className={`timeline-dot ${suco.trangThai === "DANG_XU_LY" ? 'yellow-dot' : 'gray-dot'}`} />
                                    <div className="timeline-content">
                                        <p className="step-time">
                                            {suco.trangThai === "DA_HOAN_THANH" ? "HÔM QUA" : "HÔM NAY, VỪA XONG"}
                                        </p>
                                        <p className="step-title">Đang tiến hành xử lý</p>
                                        <p className="step-desc">Đơn vị xử lý đang triển khai thi công khắc phục sự cố tại hiện trường.</p>
                                    </div>
                                </div>
                            )}

                            {suco.trangThai !== "CHO_TIEP_NHAN" && (
                                <div className={`timeline-step ${suco.trangThai === "DA_TIEP_NHAN" ? 'step-active' : 'step-done'}`}>
                                    <span className={`timeline-dot ${suco.trangThai === "DA_TIEP_NHAN" ? 'yellow-dot' : 'gray-dot'}`} />
                                    <div className="timeline-content">
                                        <p className="step-time">
                                            {new Date(suco.thoiGianTao).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, {new Date(suco.thoiGianTao).toLocaleDateString('vi-VN')}
                                        </p>
                                        <p className="step-title">Đã tiếp nhận phản ánh</p>
                                        <p className="step-desc">Hệ thống đã phê duyệt và chuyển thông tin phân công xuống các đơn vị chuyên môn liên quan.</p>
                                    </div>
                                </div>
                            )}

                            <div className={`timeline-step ${suco.trangThai === "CHO_TIEP_NHAN" ? 'step-active' : 'step-done'}`}>
                                <span className={`timeline-dot ${suco.trangThai === "CHO_TIEP_NHAN" ? 'yellow-dot' : 'gray-dot'}`} />
                                <div className="timeline-content">
                                    <p className="step-time">
                                        {new Date(suco.thoiGianTao).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, {new Date(suco.thoiGianTao).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="step-title">Gửi phản ánh thành công</p>
                                    <p className="step-desc">Công dân gửi thành công phản ánh lên cổng thông tin. Đang chờ kiểm duyệt sơ bộ.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 3: Cam kết bảo mật */}
                    <div className="sidebar-widget widget-guarantee">
                        <p className="guarantee-text">
                            Mọi thông tin phản hồi của quý khách sẽ được giữ bí mật và chỉ sử dụng để nâng cao chất lượng phục vụ công chúng.
                        </p>
                        <div className="guarantee-footer">
                            <i className="ti ti-shield" />
                            <span>Cam kết bảo mật 100%</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DetailSucoPage;