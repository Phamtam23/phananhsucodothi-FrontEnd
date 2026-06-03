import "./DetailSuco.scss";
import { useParams } from "react-router-dom";
import DetailSuCo from "../../../components/Suco/DetailSuCo";
import DanhSachPhanCong from "../../../components/PhanCong/DanhSachPhanCong";
import { useDetailSuco } from "../../../hooks/suco/useDetailSuco";

const TRANG_THAI_ACCENT: Record<string, string> = {
  CHO_TIEP_NHAN: 'CHỜ TIẾP NHẬN',
  DA_TIEP_NHAN: 'ĐÃ TIẾP NHẬN',
  DANG_XU_LY: 'ĐANG XỬ LÝ',
  DA_XU_LY_XONG: 'ĐÃ HOÀN THÀNH',
  LA_SPAM: 'SPAM',
};

const DetailSucoPage = () => {
    const { maSuCo } = useParams<{ maSuCo: string }>();
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

    const isStep2Done = suco.trangThai !== "CHO_TIEP_NHAN";
    const isStep3Done = suco.trangThai === "DA_XU_LY_XONG" || suco.trangThai === "DA_DONG";

    return (
        <div className="suco-detail-page">
            {/* Page Header */}
            <header className="page-header">
                <div className="header-left">
                    <span className={`status-badge status--${suco.trangThai.toLowerCase()}`}>
                        {TRANG_THAI_ACCENT[suco.trangThai] || suco.trangThai}
                    </span>
                    <h1 className="page-title">{suco.tieuDe || "Chi tiết phản ánh"}</h1>
                    <div className="meta-row">
                        <span className="meta-item">
                            <i className="ti ti-circle-dot" />
                            Mã: #PA-{suco.maSuCo}
                        </span>
                        <span className="meta-item">
                            <i className="ti ti-calendar" />
                            Ngày gửi: {new Date(suco.thoiGianTao).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-share">
                        <i className="ti ti-share" />
                        Chia sẻ
                    </button>
                    <button className="btn-print" onClick={printPage}>
                        <i className="ti ti-printer" />
                        In trang
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
                        <div className="map-image-container">
                            <iframe
                                title="Bản đồ sự cố"
                                src={mapEmbedUrl}
                                width="100%"
                                height="180"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                            />
                            <div className="map-badge">
                                <i className="ti ti-map-pin" />
                                BẢN ĐỒ THỰC TẾ
                            </div>
                        </div>
                        <div className="map-info-container">
                            <h4 className="widget-subtitle">Vị trí phản ánh</h4>
                            <div className="address-detail">
                                <i className="ti ti-map-pin" />
                                <span>{suco.diaDiem}</span>
                            </div>
                            <a href={mapLargeUrl} target="_blank" rel="noopener noreferrer" className="btn-directions">
                                Chỉ đường tới đây
                            </a>
                        </div>
                    </div>

                    {/* Widget 2: Tiến độ xử lý */}
                    <div className="sidebar-widget widget-timeline">
                        <div className="widget-header">
                            <i className="ti ti-chart-line" />
                            <span>Tiến độ xử lý</span>
                        </div>
                        <div className="timeline-flow">
                            <div className="timeline-step step-done">
                                <span className="timeline-dot-wrapper">
                                    <i className="ti ti-check" />
                                </span>
                                <div className="timeline-content">
                                    <h5 className="step-title">Gửi phản ánh thành công</h5>
                                    <p className="step-time">
                                        {new Date(suco.thoiGianTao).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`timeline-step ${isStep2Done ? 'step-done' : ''}`}>
                                <span className="timeline-dot-wrapper">
                                    {isStep2Done ? <i className="ti ti-check" /> : <span className="step-num">2</span>}
                                </span>
                                <div className="timeline-content">
                                    <h5 className="step-title">Đã tiếp nhận & Chuyển xử lý</h5>
                                    {isStep2Done && (
                                        <>
                                            <p className="step-time">
                                                {new Date(new Date(suco.thoiGianTao).getTime() + 18 * 60 * 60 * 1000).toLocaleString('vi-VN')}
                                            </p>
                                            <span className="timeline-badge-agency">
                                                Cơ quan quản lý: UBND Phường Thuận Hoá
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={`timeline-step ${isStep3Done ? 'step-done' : ''}`}>
                                <span className="timeline-dot-wrapper">
                                    {isStep3Done ? <i className="ti ti-check" /> : <span className="step-num">3</span>}
                                </span>
                                <div className="timeline-content">
                                    <h5 className="step-title">Đã hoàn thành</h5>
                                    {isStep3Done && (
                                        <p className="step-time">
                                            {suco.ngayDuKienHoanThanh ? new Date(suco.ngayDuKienHoanThanh).toLocaleDateString('vi-VN') : 'Đã xử lý xong'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 3: Thông tin thêm */}
                    <div className="sidebar-widget widget-info">
                        <div className="widget-header">
                            <i className="ti ti-info-circle" />
                            <span>Thông tin thêm</span>
                        </div>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="info-label">Lĩnh vực:</span>
                                <span className="info-value">{suco.loaiSuCos && suco.loaiSuCos.length > 0 ? suco.loaiSuCos.join(", ") : "Công ích & Hạ tầng"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Độ ưu tiên:</span>
                                <span className="info-value priority-medium">Trung bình</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Người phản ánh:</span>
                                <span className="info-value">Quý Ông/Bà cư dân</span>
                            </div>
                        </div>
                    </div>

                    {/* Widget 4: Cam kết bảo mật */}
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