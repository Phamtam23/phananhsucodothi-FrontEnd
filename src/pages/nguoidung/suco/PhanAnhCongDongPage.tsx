import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Building2, 
  Clock, 
  ChevronDown, 
  Search, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  Globe, 
  Share2, 
  Mail 
} from "lucide-react";
import { GetALLSuCoService, GetSuCoByTrangThaiService } from "../../../services/SucoService";
import type { SucoSumaryResponse } from "../../../types/Suco";
import heroBg from "../../../assets/Header - Hero Section.png";
import "./PhanAnhCongDong.scss";

// ── Trạng thái & Loại ─────────────────────────────────────────────────────────

const TRANG_THAI_LABELS: Record<string, { label: string; cls: string }> = {
  CHO_TIEP_NHAN:  { label: "Chờ tiếp nhận", cls: "badge--cho"   },
  DA_TIEP_NHAN:   { label: "Đã tiếp nhận",  cls: "badge--tiep"  },
  DANG_XU_LY:     { label: "Đang xử lý",    cls: "badge--dang"  },
  DA_XU_LY_XONG:  { label: "Đã hoàn thành", cls: "badge--xong"  },
  DA_DONG:        { label: "Đã đóng",        cls: "badge--dong"  },
  TU_CHOI:        { label: "Từ chối",        cls: "badge--tuchoi"},
};

const LOAI_FILTER = ["Tất cả", "Hạ tầng", "Môi trường", "An toàn"];

function thoiGianTuongDoi(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m || 1} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

// ── Mockup Data Fallback ──────────────────────────────────────────────────────

const DEFAULT_INCIDENTS = [
  {
    maSuCo: "mock-1",
    noiDung: "Sự cố chiếu sáng khu vực Lê Lợi",
    diaDiem: "Hạ tầng • Quận 1",
    trangThai: "DANG_XU_LY",
    loaiSuCos: ["HẠ TẦNG"],
    thoiGianTao: new Date(Date.now() - 3600000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
    isMock: true,
    quantam: 12
  },
  {
    maSuCo: "mock-2",
    noiDung: "Rác thải sinh hoạt ùn ứ tại công viên Tao Đàn",
    diaDiem: "Phường Bến Thành, Quận 1",
    trangThai: "CHO_TIEP_NHAN",
    loaiSuCos: ["MÔI TRƯỜNG"],
    thoiGianTao: new Date(Date.now() - 1800000).toISOString(),
    thumbnail: "",
    isMock: true,
    desc: "Khu vực thùng rác phía cổng Cách Mạng Tháng 8 đang bị quá tải, gây mùi hôi khó chịu."
  },
  {
    maSuCo: "mock-3",
    noiDung: "Lấn chiếm vỉa hè Quận 7",
    diaDiem: "Phường Tân Phong, Quận 7",
    trangThai: "DANG_XU_LY",
    loaiSuCos: ["HẠ TẦNG"],
    thoiGianTao: new Date(Date.now() - 7200000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=500&auto=format&fit=crop&q=80",
    isMock: true
  },
  {
    maSuCo: "mock-4",
    noiDung: "Hệ thống thoát nước bị tắc nghẽn",
    diaDiem: "Đường 3/2, Quận 10",
    trangThai: "DA_TIEP_NHAN",
    loaiSuCos: ["HẠ TẦNG"],
    thoiGianTao: new Date(Date.now() - 300000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?w=500&auto=format&fit=crop&q=80",
    isMock: true,
    desc: "Sau cơn mưa lớn sáng nay, đoạn đường 3/2 xuất hiện tình trạng ngập cục bộ do cống tắc."
  },
  {
    maSuCo: "mock-5",
    noiDung: "Biển báo giao thông bị nghiêng",
    diaDiem: "Ngã tư CMT8, Quận 3",
    trangThai: "CHO_TIEP_NHAN",
    loaiSuCos: ["TRẬT TỰ ĐÔ THỊ"],
    thoiGianTao: new Date(Date.now() - 1080000).toISOString(),
    thumbnail: "",
    isMock: true,
    desc: "Biển cấm đỗ xe tại ngã tư bị đổ nghiêng sang một bên, có nguy cơ rơi xuống đường."
  },
  {
    maSuCo: "mock-6",
    noiDung: "Cây xanh cần được cắt tỉa",
    diaDiem: "Phố đi bộ Nguyễn Huệ, Quận 1",
    trangThai: "DA_TIEP_NHAN",
    loaiSuCos: ["CẢNH QUAN"],
    thoiGianTao: new Date(Date.now() - 2280000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80",
    isMock: true,
    desc: "Nhánh cây lớn vươn ra che khuất đèn tín hiệu giao thông tại phố đi bộ."
  }
];

const PAGE_SIZE = 12;

const PhanAnhCongDongPage = () => {
  const navigate = useNavigate();
  const [danhSach, setDanhSach] = useState<SucoSumaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locTrangThai, setLocTrangThai] = useState("Trạng thái");
  const [locLoai, setLocLoai] = useState("Tất cả");
  const [trangHienTai, setTrangHienTai] = useState(0);
  const [tongSo, setTongSo] = useState(0);
  const [hetTrang, setHetTrang] = useState(false);
  const [showTrangThaiMenu, setShowTrangThaiMenu] = useState(false);

  const TRANG_THAI_OPTIONS = ["Trạng thái", ...Object.values(TRANG_THAI_LABELS).map(t => t.label)];

  const layDuLieu = useCallback(async (trang: number, reset = false) => {
    setLoading(true);
    try {
      const key = Object.entries(TRANG_THAI_LABELS).find(([, v]) => v.label === locTrangThai)?.[0];
      let res;
      if (key) {
        res = await GetSuCoByTrangThaiService(key, trang, PAGE_SIZE);
      } else {
        res = await GetALLSuCoService(trang, PAGE_SIZE);
      }
      if (res.status === 200 && res.data) {
        const list = res.data.content ?? [];
        setDanhSach(prev => reset ? list : [...prev, ...list]);
        setTongSo(res.data.pagination?.totalElements ?? 0);
        setHetTrang(res.data.pagination?.last ?? true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [locTrangThai]);

  useEffect(() => {
    setTrangHienTai(0);
    setDanhSach([]);
    layDuLieu(0, true);
  }, [locTrangThai, layDuLieu]);

  const taiThem = () => {
    const next = trangHienTai + 1;
    setTrangHienTai(next);
    layDuLieu(next);
  };

  // Lọc client-side kết hợp từ khóa & loại danh mục
  const danhSachHienThi = danhSach.filter(sc => {
    const q = tuKhoa.toLowerCase();
    const matchesKeyword = !q || sc.noiDung?.toLowerCase().includes(q) || sc.diaDiem?.toLowerCase().includes(q);
    
    const matchesCategory = locLoai === "Tất cả" || 
      (sc.loaiSuCos && sc.loaiSuCos.some(l => l.toLowerCase().includes(locLoai.toLowerCase().slice(0, 5))));
      
    return matchesKeyword && matchesCategory;
  });

  const goDetail = (maSuCo: string) => {
    if (maSuCo.startsWith("mock-")) {
      alert("Đây là sự cố mẫu minh họa giao diện. Bạn có thể bấm vào các sự cố thật bên dưới để xem chi tiết!");
      return;
    }
    navigate(`/suco/detail/${maSuCo}`);
  };

  // Ánh xạ dữ liệu động lên bố cục mẫu tĩnh
  const getIncidentData = (index: number) => {
    if (danhSachHienThi[index]) {
      return {
        ...danhSachHienThi[index],
        isMock: false
      };
    }
    return DEFAULT_INCIDENTS[index];
  };

  const card0 = getIncidentData(0);
  const card1 = getIncidentData(1);
  const card2 = getIncidentData(2);
  const card3 = getIncidentData(3);
  const card4 = getIncidentData(4);
  const card5 = getIncidentData(5);

  const danhSachConLai = danhSachHienThi.slice(6);

  return (
    <div className="pacd">
      {/* ── 1. Hero header ── */}
      <div 
        className="pacd__hero" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.85) 45%, rgba(255, 255, 255, 0) 100%), url(${heroBg})` 
        }}
      >
        <div className="pacd__hero-inner">
          <div className="hero-slogan">CỔNG THÔNG TIN TƯƠNG TÁC</div>
          <h1 className="hero-title">
            Phản ánh <span className="highlight">Cộng đồng</span>
          </h1>
          <p className="hero-desc">
            Minh bạch hóa việc quản lý đô thị và yêu cầu dịch vụ công.<br />
            Đóng góp của bạn giúp xây dựng thành phố tốt đẹp hơn mỗi ngày.
          </p>
        </div>
      </div>

      {/* ── 2. Toolbar & Bộ lọc ── */}
      <div className="pacd__toolbar">
        <div className="pacd__toolbar-inner">
          {/* Tìm kiếm */}
          <div className="pacd__search">
            <Search size={15} />
            <input
              placeholder="Tìm kiếm phản ánh theo từ khóa, địa chỉ..."
              value={tuKhoa}
              onChange={e => setTuKhoa(e.target.value)}
            />
          </div>

          {/* Lọc loại */}
          <div className="pacd__loai-tabs">
            {LOAI_FILTER.map(l => (
              <button
                key={l}
                className={`pacd__loai-tab ${locLoai === l ? "active" : ""}`}
                onClick={() => setLocLoai(l)}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Lọc trạng thái */}
          <div className="pacd__tt-select" onClick={() => setShowTrangThaiMenu(v => !v)}>
            <span>{locTrangThai}</span>
            <ChevronDown size={14} />
            {showTrangThaiMenu && (
              <div className="pacd__tt-menu">
                {TRANG_THAI_OPTIONS.map(o => (
                  <div
                    key={o}
                    className={`pacd__tt-option ${locTrangThai === o ? "active" : ""}`}
                    onClick={e => { 
                      e.stopPropagation(); 
                      setLocTrangThai(o); 
                      setShowTrangThaiMenu(false); 
                    }}
                  >
                    {o}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hiển thị số lượng */}
          <div className="pacd__count">
            Hiển thị <strong>{danhSachHienThi.length}</strong> / {tongSo || DEFAULT_INCIDENTS.length} phản ánh
          </div>

          {/* Floating Circle Add Button */}
          <button 
            className="pacd__btn-add-floating" 
            onClick={() => navigate("/suco/create")} 
            title="Gửi phản ánh mới"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* ── 3. Main Content Sections ── */}
      <div className="pacd__content">
        
        {/* ── Section A: Tiêu điểm - Gần bạn nhất ── */}
        <section className="pacd__section pacd__featured-section">
          <div className="pacd__section-header">
            <div className="pacd__section-title-wrap">
              <span className="pacd__section-subtitle">TIÊU ĐIỂM</span>
              <h2 className="pacd__section-title">Gần bạn nhất</h2>
            </div>
            <button className="pacd__btn-view-all" onClick={() => setLocLoai("Tất cả")}>
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>

          <div className="pacd__featured-grid">
            {/* Trái: Large Card */}
            <div className="featured-card-tall" onClick={() => goDetail(card0.maSuCo)}>
              <div className="card-image-wrap">
                {card0.thumbnail ? (
                  <img src={card0.thumbnail} alt={card0.noiDung} />
                ) : (
                  <div className="card-image-placeholder"><MapPin size={40} /></div>
                )}
                <span className="card-badge badge-infrastructure">
                  {card0.loaiSuCos?.[0] || "HẠ TẦNG"} • QUẬN 1
                </span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{card0.noiDung}</h3>
                <div className="card-footer-info">
                  <span className="interest-count">Đang được 12 người quan tâm</span>
                </div>
              </div>
            </div>

            {/* Phải: Column Layout */}
            <div className="featured-right-column">
              {/* Top Card: Wide Card Row */}
              <div className="featured-card-wide" onClick={() => goDetail(card1.maSuCo)}>
                <div className="card-content">
                  <div className="card-top-row">
                    <span className="card-badge badge-environment">
                      {card1.loaiSuCos?.[0] || "MÔI TRƯỜNG"}
                    </span>
                    <span className={`status-badge ${TRANG_THAI_LABELS[card1.trangThai]?.cls || "badge--cho"}`}>
                      {TRANG_THAI_LABELS[card1.trangThai]?.label || card1.trangThai}
                    </span>
                  </div>
                  <h3 className="card-title">{card1.noiDung}</h3>
                  <p className="card-desc">
                    {card1.desc || card1.noiDung}
                  </p>
                  <div className="card-footer-row">
                    <span className="card-distance">Cách bạn 650m</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Row: Left Small & Right Yellow */}
              <div className="featured-bottom-row">
                <div className="featured-card-small" onClick={() => goDetail(card2.maSuCo)}>
                  <div className="card-image-wrap">
                    {card2.thumbnail ? (
                      <img src={card2.thumbnail} alt={card2.noiDung} />
                    ) : (
                      <div className="card-image-placeholder"><MapPin size={24} /></div>
                    )}
                    <span className="card-badge badge-infrastructure">
                      {card2.loaiSuCos?.[0] || "HẠ TẦNG"}
                    </span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{card2.noiDung}</h3>
                    <span className="card-distance">Cách bạn 1.2km</span>
                  </div>
                </div>

                <div className="featured-card-cta" onClick={() => navigate("/suco/create")}>
                  <span className="cta-label">HỎI ĐÁP</span>
                  <h3 className="cta-title">Góp ý của bạn?</h3>
                  <p className="cta-desc">Đang có 4 sự cố gần bạn cần xác nhận.</p>
                  <div className="cta-arrow">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section B: Thời gian thực - Mới cập nhật ── */}
        <section className="pacd__section pacd__realtime-section">
          <div className="pacd__section-header">
            <div className="pacd__section-title-wrap">
              <span className="pacd__section-subtitle">THỜI GIAN THỰC</span>
              <h2 className="pacd__section-title">Mới cập nhật</h2>
            </div>
            <div className="pacd__slider-arrows">
              <button className="arrow-btn" onClick={() => alert("Chức năng trượt sẽ khả dụng khi có nhiều phản ánh mới.")}>
                <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button className="arrow-btn" onClick={() => alert("Chức năng trượt sẽ khả dụng khi có nhiều phản ánh mới.")}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="pacd__realtime-grid">
            {/* Card 1 */}
            <div className="realtime-card" onClick={() => goDetail(card3.maSuCo)}>
              <div className="card-image-wrap">
                {card3.thumbnail ? (
                  <img src={card3.thumbnail} alt={card3.noiDung} />
                ) : (
                  <div className="card-image-placeholder"><MapPin size={28} /></div>
                )}
                <span className="card-badge badge-infrastructure">
                  {card3.loaiSuCos?.[0] || "HẠ TẦNG"}
                </span>
              </div>
              <div className="card-body">
                <span className="card-subtitle">VỪA XONG • QUẬN 10</span>
                <h3 className="card-title">{card3.noiDung}</h3>
                <p className="card-desc">{card3.desc || card3.noiDung}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="realtime-card" onClick={() => goDetail(card4.maSuCo)}>
              <div className="card-image-wrap">
                {card4.thumbnail ? (
                  <img src={card4.thumbnail} alt={card4.noiDung} />
                ) : (
                  <div className="card-image-placeholder"><MapPin size={28} /></div>
                )}
                <span className="card-badge badge-order">
                  {card4.loaiSuCos?.[0] || "TRẬT TỰ"}
                </span>
              </div>
              <div className="card-body">
                <span className="card-subtitle">18 PHÚT TRƯỚC • QUẬN 3</span>
                <h3 className="card-title">{card4.noiDung}</h3>
                <p className="card-desc">{card4.desc || card4.noiDung}</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="realtime-card" onClick={() => goDetail(card5.maSuCo)}>
              <div className="card-image-wrap">
                {card5.thumbnail ? (
                  <img src={card5.thumbnail} alt={card5.noiDung} />
                ) : (
                  <div className="card-image-placeholder"><MapPin size={28} /></div>
                )}
                <span className="card-badge badge-landscape">
                  {card5.loaiSuCos?.[0] || "CẢNH QUAN"}
                </span>
              </div>
              <div className="card-body">
                <span className="card-subtitle">38 PHÚT TRƯỚC • QUẬN 1</span>
                <h3 className="card-title">{card5.noiDung}</h3>
                <p className="card-desc">{card5.desc || card5.noiDung}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section C: Danh sách phản ánh khác (Dữ liệu Động hoàn toàn) ── */}
        {danhSachConLai.length > 0 && (
          <section className="pacd__section pacd__remaining-section">
            <div className="pacd__section-header">
              <div className="pacd__section-title-wrap">
                <span className="pacd__section-subtitle">HỆ THỐNG</span>
                <h2 className="pacd__section-title">Danh sách phản ánh khác</h2>
              </div>
            </div>

            <div className="pacd__realtime-grid">
              {danhSachConLai.map((sc) => (
                <div key={sc.maSuCo} className="realtime-card" onClick={() => goDetail(sc.maSuCo)}>
                  <div className="card-image-wrap">
                    {sc.thumbnail ? (
                      <img src={sc.thumbnail} alt={sc.noiDung} />
                    ) : (
                      <div className="card-image-placeholder"><MapPin size={28} /></div>
                    )}
                    <span className="card-badge">
                      {sc.loaiSuCos?.[0] || "SỰ CỐ"}
                    </span>
                  </div>
                  <div className="card-body">
                    <span className="card-subtitle">
                      {thoiGianTuongDoi(sc.thoiGianTao).toUpperCase()} • {sc.diaDiem}
                    </span>
                    <h3 className="card-title">{sc.noiDung}</h3>
                    <p className="card-desc">{sc.noiDung}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tải thêm */}
            {!hetTrang && !loading && (
              <div className="pacd__load-more">
                <button onClick={taiThem} className="pacd__btn-load">
                  Xem thêm phản ánh
                </button>
              </div>
            )}
            {loading && (
              <div className="pacd__loading-more">Đang tải thêm...</div>
            )}
          </section>
        )}

        {/* ── Section D: Ba Khung tính năng CTA Widget ở chân trang ── */}
        <section className="pacd__cta-widgets">
          {/* Khung 1 */}
          <div className="cta-widget-card widget--create">
            <div className="widget-header-row">
              <h3>Gửi phản ánh mới</h3>
              <div className="widget-icon-box"><Plus size={18} /></div>
            </div>
            <p>Chụp ảnh và mô tả sự cố để gửi chỉ thị quyền hỗ trợ kịp thời.</p>
            <button className="widget-btn-primary" onClick={() => navigate("/suco/create")}>
              Bắt đầu ngay <ArrowRight size={14} />
            </button>
          </div>

          {/* Khung 2 */}
          <div className="cta-widget-card widget--map">
            <div className="widget-header-row">
              <h3>Bản đồ nhiệt</h3>
              <div className="widget-icon-box"><MapPin size={18} /></div>
            </div>
            <p>Theo dõi các điểm nóng về hạ tầng và môi trường toàn thành phố.</p>
            <button className="widget-btn-secondary" onClick={() => navigate("/suco/lich-su")}>
              Xem bản đồ <ArrowRight size={14} />
            </button>
          </div>

          {/* Khung 3 */}
          <div className="cta-widget-card widget--guide">
            <div className="widget-header-row">
              <h3>Quy trình xử lý</h3>
              <div className="widget-icon-box"><Building2 size={18} /></div>
            </div>
            <p>Tìm hiểu cách thức phản ánh của bạn được chính quyền tiếp nhận.</p>
            <button className="widget-btn-secondary" onClick={() => alert("Quy trình gồm 4 bước: 1. Tiếp nhận -> 2. Duyệt phân công -> 3. Xử lý hiện trường -> 4. Đánh giá kết quả.")}>
              Xem quy trình <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </div>

      {/* ── 4. Premium Footer ── */}
      <footer className="pacd__footer">
        <div className="footer-columns">
          {/* Cột 1 */}
          <div className="footer-col col-brand">
            <h2 className="footer-logo">Civic Gallery</h2>
            <p className="footer-brand-desc">
              Nền tảng kiến tạo tương lai đô thị thông qua sức mạnh của cộng đồng và sự minh bạch của dữ liệu.
            </p>
          </div>

          {/* Cột 2 */}
          <div className="footer-col">
            <h3>KHÁM PHÁ</h3>
            <ul>
              <li onClick={() => setLocLoai("Tất cả")}>Tất cả phản ánh</li>
              <li onClick={() => alert("Thống kê số liệu phản ánh đang được cập nhật!")}>Thống kê thành phố</li>
              <li onClick={() => navigate("/suco/lich-su")}>Bản đồ tương tác</li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="footer-col">
            <h3>HỖ TRỢ</h3>
            <ul>
              <li onClick={() => alert("Tổng đài hỗ trợ kỹ thuật: 1900 1000 (nhánh 2)")}>Câu hỏi thường gặp</li>
              <li onClick={() => alert("Chính sách bảo mật thông tin công dân cam kết 100% không lộ danh tính.")}>Quy định bảo mật</li>
              <li onClick={() => alert("Email hỗ trợ: canbo@civicgallery.gov.vn")}>Liên hệ cán bộ</li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div className="footer-col col-connect">
            <h3>KẾT NỐI</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Website"><Globe size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Chia sẻ"><Share2 size={18} /></a>
              <a href="mailto:support@civicgallery.gov.vn" title="Email"><Mail size={18} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 CIVIC GALLERY. PHÁT TRIỂN BỞI TRUNG TÂM ĐIỀU HÀNH ĐÔ THỊ</p>
          <div className="footer-policy-links">
            <span>ĐIỀU KHOẢN</span>
            <span>RIÊNG TƯ</span>
            <span>COOKIES</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PhanAnhCongDongPage;
