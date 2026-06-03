import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import "./KiemDuyetDetailPage.scss";

import { CreatePhieuKiemDuyetService } from "../../services/PhieuKiemDuyetService";
import { useDetailSuco } from "../../hooks/suco/useDetailSuco";
import { API_CONFIG } from "../../constants/app.constants";
import { formatDateTime } from "../../utils/Format";
import { TrangThaiKiemDuyet } from "../../types/PhieuKiemDuyet";

import type {
  CreatePhieuKiemDuyetRequest,
  PhieuKiemDuyetResponse,
} from "../../types/PhieuKiemDuyet";

const KiemDuyetDetailPage = () => {
  const navigate = useNavigate();
  const { maSuCo } = useParams();

  const [lyDo, setLyDo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dangChon, setDangChon] = useState<TrangThaiKiemDuyet | null>(null);
  const [phieuKetQua, setPhieuKetQua] = useState<PhieuKiemDuyetResponse | null>(null);

  const { suco, loading: loadingSuco, error: errorSuco } = useDetailSuco(maSuCo || "");
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (!suco?.medias || suco.medias.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % suco.medias.length);
  };

  const prevSlide = () => {
    if (!suco?.medias || suco.medias.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + suco.medias.length) % suco.medias.length);
  };

  if (!maSuCo) {
    return (
      <div className="kdp-page">
        <div className="kdp-panel">
          <p>Không tìm thấy mã sự cố.</p>
        </div>
      </div>
    );
  }

  if (loadingSuco) {
    return (
      <div className="kdp-page">
        <div className="kdp-loading">Đang tải chi tiết sự cố...</div>
      </div>
    );
  }

  if (errorSuco || !suco) {
    return (
      <div className="kdp-page">
        <div className="kdp-error-panel">
          <p>{errorSuco || "Không tìm thấy thông tin sự cố."}</p>
          <button className="kdp-btn kdp-btn--back" onClick={() => navigate(-1)}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (trangThaiKiemDuyet: TrangThaiKiemDuyet) => {
    if (
      (trangThaiKiemDuyet === TrangThaiKiemDuyet.TU_CHOI ||
        trangThaiKiemDuyet === TrangThaiKiemDuyet.BO_SUNG) &&
      !lyDo.trim()
    ) {
      setError(
        trangThaiKiemDuyet === TrangThaiKiemDuyet.TU_CHOI
          ? "Vui lòng nhập lý do từ chối."
          : "Vui lòng nhập nội dung yêu cầu bổ sung."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDangChon(trangThaiKiemDuyet);

      const body: CreatePhieuKiemDuyetRequest = {
        maSuCo,
        trangThaiKiemDuyet,
        lyDoTuChoi:
          trangThaiKiemDuyet !== TrangThaiKiemDuyet.DUYET
            ? lyDo.trim()
            : "",
      };

      const res = await CreatePhieuKiemDuyetService(body);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Kiểm duyệt thất bại.");
      }

      setPhieuKetQua(res.data);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Có lỗi xảy ra."
      );
      setDangChon(null);
    } finally {
      setLoading(false);
    }
  };

  const isDuyet = phieuKetQua?.trangThai === TrangThaiKiemDuyet.DUYET;
  const isBoSung = phieuKetQua?.trangThai === TrangThaiKiemDuyet.BO_SUNG;

  const getStatusLabel = (trangThai: string) => {
    switch (trangThai) {
      case "CHO_TIEP_NHAN":
        return "ĐANG CHỜ DUYỆT";
      case "DA_TIEP_NHAN":
        return "ĐÃ TIẾP NHẬN";
      case "TU_CHOI":
        return "ĐÃ TỪ CHỐI";
      case "BO_SUNG":
        return "CẦN BỔ SUNG";
      case "DANG_XU_LY":
        return "ĐANG XỬ LÝ";
      case "DA_XU_LY_XONG":
        return "ĐÃ HOÀN THÀNH";
      case "DA_DONG":
        return "ĐÃ ĐÓNG";
      default:
        return trangThai;
    }
  };

  const lat = suco.viDo;
  const lon = suco.kinhDo;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.003}%2C${lat - 0.002}%2C${lon + 0.003}%2C${lat + 0.002}&layer=mapnik&marker=${lat}%2C${lon}`;
  const mapLargeUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

  return (
    <div className="kdp-page">
      {/* Breadcrumbs */}
      <div className="kdp-breadcrumbs">
        <span className="kdp-breadcrumb-item" onClick={() => navigate("/nhanviendieuphoi/kiemduyet")}>
          Danh sách phản ánh
        </span>
        <span className="kdp-breadcrumb-separator">&gt;</span>
        <span className="kdp-breadcrumb-item active">Chi tiết kiểm duyệt</span>
      </div>

      {/* Page Title */}
      <h1 className="kdp-page-title">Kiểm duyệt Sự cố</h1>

      {/* Grid Layout */}
      <div className="kdp-layout">
        {/* Left Column: Details */}
        <div className="kdp-main">
          <div className="kdp-suco-card">
            {/* Top Code & Status */}
            <div className="kdp-suco-header">
              <div className="kdp-suco-title-group">
                <div className="kdp-suco-warning-icon">
                  <i className="ti ti-alert-triangle" />
                </div>
                <div>
                  <span className="kdp-suco-code-label">MÃ SỰ CỐ</span>
                  <h2 className="kdp-suco-code-value">{suco.maSuCo}</h2>
                </div>
              </div>
              <span className={`kdp-status-badge status--${suco.trangThai.toLowerCase()}`}>
                {getStatusLabel(suco.trangThai)}
              </span>
            </div>

            {/* Incident Slideshow */}
            <div className="kdp-slideshow">
              {suco.medias && suco.medias.length > 0 ? (
                <div className="slideshow-container">
                  <div className="slideshow-wrapper">
                    <img
                      src={API_CONFIG.BASE_URL + suco.medias[currentSlide].url}
                      alt={`Minh chứng phản ánh ${currentSlide + 1}`}
                      className="slide-image"
                    />

                    {suco.medias.length > 1 && (
                      <>
                        <button className="slide-arrow prev-arrow" onClick={prevSlide}>
                          &#10094;
                        </button>
                        <button className="slide-arrow next-arrow" onClick={nextSlide}>
                          &#10095;
                        </button>

                        <span className="slide-badge">
                          {currentSlide + 1} / {suco.medias.length}
                        </span>
                      </>
                    )}
                  </div>

                  {suco.medias.length > 1 && (
                    <div className="slide-dots">
                      {suco.medias.map((_, index) => (
                        <span
                          key={index}
                          className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="slideshow-placeholder">
                  <i className="ti ti-image" />
                  <span>Không có hình ảnh đính kèm</span>
                </div>
              )}
            </div>

            {/* Vị trí phản ánh */}
            <div className="kdp-section">
              <span className="kdp-section-label">VỊ TRÍ PHẢN ÁNH</span>
              <div className="kdp-location-box">
                <i className="ti ti-map-pin" />
                <span>{suco.diaDiem}</span>
              </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="kdp-section">
              <span className="kdp-section-label">NỘI DUNG CHI TIẾT TỪ CÔNG DÂN</span>
              <div className="kdp-content-box">
                {suco.tieuDe && (
                  <p className="kdp-content-title">
                    “{suco.tieuDe}”
                  </p>
                )}
                <p className="kdp-content-description">
                  {suco.noiDung || "Không có nội dung mô tả phản ánh."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Moderation & Map */}
        <div className="kdp-sidebar">
          {/* Moderation Form Panel / Results */}
          {phieuKetQua ? (
            <div className="kdp-moderation-panel">
              <div className="kdp-panel-header">
                <i className="ti ti-shield-check kdp-panel-icon-shield" />
                <h3 className="kdp-panel-title">Kết quả Kiểm duyệt</h3>
              </div>
              
              <div className={`kdp-success-box ${isDuyet
                  ? "kdp-success-green"
                  : isBoSung
                  ? "kdp-success-purple"
                  : "kdp-success-red"
                }`}
              >
                <span className={`kdp-success-icon ${isDuyet
                    ? "kdp-icon-green"
                    : isBoSung
                    ? "kdp-icon-purple"
                    : "kdp-icon-red"
                  }`}
                >
                  {isDuyet ? "✓" : isBoSung ? "ℹ" : "✕"}
                </span>

                <div className="kdp-success-text-wrap">
                  <p className="kdp-success-title">
                    {isDuyet
                      ? "Đã duyệt sự cố thành công"
                      : isBoSung
                      ? "Đã gửi yêu cầu bổ sung thông tin"
                      : "Đã từ chối sự cố"}
                  </p>

                  <p className="kdp-success-sub">
                    Mã phiếu: <strong>{phieuKetQua.maKiemDuyet}</strong>
                  </p>

                  <p className="kdp-success-sub">
                    Mã sự cố: <strong>{maSuCo}</strong>
                  </p>

                  {phieuKetQua.lyDoTuChoi && (
                    <p className="kdp-success-sub">
                      Nội dung/Lý do: <strong>{phieuKetQua.lyDoTuChoi}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="kdp-moderation-panel">
              {/* Header */}
              <div className="kdp-panel-header">
                <i className="ti ti-shield-check kdp-panel-icon-shield" />
                <h3 className="kdp-panel-title">Xử lý Kiểm duyệt</h3>
              </div>

              {/* Input lý do */}
              <div className="kdp-field">
                <label className="kdp-label">
                  LÝ DO XỬ LÝ / YÊU CẦU BỔ SUNG{" "}
                  <span className="kdp-hint-required">
                    (bắt buộc khi từ chối)
                  </span>
                </label>

                <textarea
                  className={`kdp-textarea ${error ? "kdp-textarea--error" : ""}`}
                  rows={4}
                  placeholder="Nhập lý do từ chối hoặc các thông tin yêu cầu công dân bổ sung thêm để quá trình xử lý diễn ra thuận lợi..."
                  value={lyDo}
                  disabled={loading}
                  onChange={(e) => {
                    setLyDo(e.target.value);
                    if (error) {
                      setError(null);
                    }
                  }}
                />

                {error && (
                  <p className="kdp-error-text">
                    <i className="ti ti-alert-circle" /> {error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="kdp-actions-vertical">
                {/* Approve Button (Big, primary style) */}
                <button
                  className="kdp-btn kdp-btn--approve-large"
                  disabled={loading}
                  onClick={() => handleSubmit(TrangThaiKiemDuyet.DUYET)}
                >
                  {loading && dangChon === TrangThaiKiemDuyet.DUYET ? (
                    <span className="kdp-spinner" />
                  ) : (
                    <>
                      <i className="ti ti-circle-check" /> Duyệt sự cố
                    </>
                  )}
                </button>

                {/* Reject and Require Info in a row */}
                <div className="kdp-actions-row">
                  {/* Require Info */}
                  <button
                    className="kdp-btn kdp-btn--require-info"
                    disabled={loading}
                    onClick={() => handleSubmit(TrangThaiKiemDuyet.BO_SUNG)}
                  >
                    {loading && dangChon === TrangThaiKiemDuyet.BO_SUNG ? (
                      <span className="kdp-spinner" />
                    ) : (
                      <>
                        <i className="ti ti-info-circle" /> Yêu cầu bổ sung
                      </>
                    )}
                  </button>

                  {/* Reject */}
                  <button
                    className="kdp-btn kdp-btn--reject"
                    disabled={loading}
                    onClick={() => handleSubmit(TrangThaiKiemDuyet.TU_CHOI)}
                  >
                    {loading && dangChon === TrangThaiKiemDuyet.TU_CHOI ? (
                      <span className="kdp-spinner" />
                    ) : (
                      <>
                        <i className="ti ti-circle-x" /> Từ chối
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Time of creation & Help icon */}
              <div className="kdp-creation-time">
                <span className="kdp-time-text">
                  <i className="ti ti-history" /> THỜI GIAN TẠO: {formatDateTime(suco.thoiGianTao)}
                </span>
                <i className="ti ti-help-circle help-icon" />
              </div>
            </div>
          )}

          {/* Interactive Map Widget */}
          <div className="kdp-map-card">
            <a href={mapLargeUrl} target="_blank" rel="noopener noreferrer" className="kdp-map-header-link">
              <div className="kdp-map-header">
                <div className="kdp-map-title-row">
                  <i className="ti ti-map kdp-map-icon" />
                  <div>
                    <h4 className="kdp-map-title">XEM TRÊN BẢN ĐỒ</h4>
                    <p className="kdp-map-subtitle">Xem vị trí lân cận để tối ưu hóa lộ trình sửa chữa</p>
                  </div>
                </div>
                <i className="ti ti-chevron-right kdp-map-arrow" />
              </div>
            </a>
            <div className="kdp-map-iframe-container">
              <iframe
                title="Bản đồ sự cố"
                src={mapEmbedUrl}
                width="100%"
                height="220"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KiemDuyetDetailPage;