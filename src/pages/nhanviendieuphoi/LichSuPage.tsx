import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePhieuPhanCongNhanVien } from "../../hooks/phancong/usePhieuPhanCongNhanVien";
import { usePhieuKiemDuyetNhanVien } from "../../hooks/kiemDuyet/usePhieuKiemDuyetNhanVien";
import { defaultPhieuPhanCongFilter } from "../../types/PhieuPhanCong";
import Pagination from "../../components/Page/Pagination";
import type { KiemDuyetFilter } from "../../services/PhieuKiemDuyetService";
import type { DonViXuLyResponse } from "../../types/DonViXuLy";
import type { LoaiResponse } from "../../types/Loai";
import { GetAllDonViXuLyService } from "../../services/DonViXuLy";
import { GetAllLoaiService } from "../../services/LoaiService";
import { 
  History, 
  FileText, 
  CheckSquare, 
  Calendar, 
  Eye, 
  Filter
} from "lucide-react";
import "./LichSuPage.scss";

type TabType = "phan-cong" | "kiem-duyet";

const defaultKiemDuyetFilter: KiemDuyetFilter = { page: 0, size: 10 };

const getStatusBadge = (trangThai: string) => {
  switch (trangThai) {
    // PhieuPhanCong / PhieuKiemDuyet Statuses
    case "DUYET":
    case "HOAN_THANH":
    case "DA_XAC_NHAN":
      return <span className="badge-lich-su xong">Hoàn thành / Đã duyệt</span>;
    case "DANG_XU_LY":
    case "CHO_DUYET_KET_QUA":
      return <span className="badge-lich-su dang">Đang xử lý</span>;
    case "CHO_KIEM_DUYET":
    case "CHO_XAC_NHAN":
    case "DANG_CHO":
      return <span className="badge-lich-su cho">Chờ xử lý</span>;
    case "TU_CHOI":
      return <span className="badge-lich-su tu-choi">Từ chối</span>;
    case "BO_SUNG":
      return <span className="badge-lich-su bo-sung">Cần bổ sung</span>;
    default:
      return <span className="badge-lich-su cho">{trangThai}</span>;
  }
};

const LichSuPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("phan-cong");

  // Danh sách đơn vị & loại
  const [danhSachDonVi, setDanhSachDonVi] = useState<DonViXuLyResponse[]>([]);
  const [danhSachLoai, setDanhSachLoai] = useState<LoaiResponse[]>([]);

  useEffect(() => {
    GetAllDonViXuLyService()
      .then(res => setDanhSachDonVi(res.data ?? []))
      .catch(() => {});
    GetAllLoaiService()
      .then(res => setDanhSachLoai(res.data ?? []))
      .catch(() => {});
  }, []);

  // Filter phân công
  const [filterPC, setFilterPC] = useState(defaultPhieuPhanCongFilter);
  const { data: dataPC, loading: loadingPC } = usePhieuPhanCongNhanVien(filterPC);

  // Filter kiểm duyệt
  const [filterKD, setFilterKD] = useState<KiemDuyetFilter>(defaultKiemDuyetFilter);
  const { data: dataKD, loading: loadingKD } = usePhieuKiemDuyetNhanVien(filterKD);

  const handleResetPC = () => setFilterPC(defaultPhieuPhanCongFilter);
  const handleResetKD = () => setFilterKD({ page: 0, size: 10 });

  return (
    <div className="lich-su-page">
      {/* Header section with Stats */}
      <div className="lich-su-header-section">
        <div className="lich-su-title-box">
          <div className="title-row">
            <History size={24} className="icon-title" />
            <h2>Lịch sử hoạt động của tôi</h2>
          </div>
          <p>Xem lại toàn bộ lịch sử phân công điều phối và kiểm duyệt sự cố do bạn thực hiện.</p>
        </div>

        <div className="lich-su-summary-cards">
          <div className="lich-su-card">
            <div className="lich-su-card-content">
              <span className="lich-su-card-title">Phiếu phân công</span>
              <div className="lich-su-card-value">
                {dataPC?.pagination.totalElements ?? 0}
                <span className="lich-su-card-subtext">đã lập</span>
              </div>
            </div>
            <div className="lich-su-card-icon blue">
              <FileText size={20} />
            </div>
          </div>

          <div className="lich-su-card">
            <div className="lich-su-card-content">
              <span className="lich-su-card-title">Phiếu kiểm duyệt</span>
              <div className="lich-su-card-value">
                {dataKD?.pagination.totalElements ?? 0}
                <span className="lich-su-card-subtext">đã duyệt</span>
              </div>
            </div>
            <div className="lich-su-card-icon orange">
              <CheckSquare size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="lich-su-tabs-container">
        <div className="lich-su-tabs">
          <button
            className={activeTab === "phan-cong" ? "active" : ""}
            onClick={() => setActiveTab("phan-cong")}
          >
            Lịch sử phân công
          </button>
          <button
            className={activeTab === "kiem-duyet" ? "active" : ""}
            onClick={() => setActiveTab("kiem-duyet")}
          >
            Lịch sử kiểm duyệt
          </button>
        </div>
      </div>

      {/* Tab content: Phân công */}
      {activeTab === "phan-cong" && (
        <div className="tab-content-wrapper">
          <div className="filter-card">
            <div className="filter-header">
              <Filter size={16} />
              <span>Bộ lọc tìm kiếm</span>
            </div>
            <div className="lich-su-filter">
              <div className="filter-item">
                <label>Từ ngày</label>
                <div className="input-with-icon">
                  <Calendar size={14} />
                  <input
                    type="date"
                    value={filterPC.tuNgay ?? ""}
                    onChange={(e) => setFilterPC(p => ({ ...p, tuNgay: e.target.value || undefined, page: 0 }))}
                  />
                </div>
              </div>
              
              <div className="filter-item">
                <label>Đến ngày</label>
                <div className="input-with-icon">
                  <Calendar size={14} />
                  <input
                    type="date"
                    value={filterPC.denNgay ?? ""}
                    onChange={(e) => setFilterPC(p => ({ ...p, denNgay: e.target.value || undefined, page: 0 }))}
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>Đơn vị xử lý</label>
                <select
                  value={filterPC.maDonVi ?? ""}
                  onChange={(e) => setFilterPC(p => ({ ...p, maDonVi: e.target.value || undefined, page: 0 }))}
                  className="filter-select"
                >
                  <option value="">Tất cả đơn vị</option>
                  {danhSachDonVi.map(dv => (
                    <option key={dv.maDonViXuLy} value={dv.maDonViXuLy}>
                      {dv.tenDonVi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label>Loại sự cố</label>
                <select
                  value={filterPC.maLoai ?? ""}
                  onChange={(e) => setFilterPC(p => ({ ...p, maLoai: e.target.value || undefined, page: 0 }))}
                  className="filter-select"
                >
                  <option value="">Tất cả loại</option>
                  {danhSachLoai.map(loai => (
                    <option key={loai.maLoai} value={loai.maLoai}>
                      {loai.tenLoaiSuCo}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn-reset" onClick={handleResetPC}>Đặt lại bộ lọc</button>
            </div>
          </div>

          <div className="table-card">
            {loadingPC ? (
              <div className="lich-su-loading">
                <div className="kd-spinner" />
                <p>Đang tải lịch sử phân công...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Mã phiếu</th>
                      <th>Tiêu đề sự cố</th>
                      <th>Địa điểm</th>
                      <th style={{ width: "180px" }}>Trạng thái</th>
                      <th style={{ width: "160px" }}>Thời gian lập</th>
                      <th style={{ width: "80px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!dataPC?.content.length ? (
                      <tr>
                        <td colSpan={6} className="no-data">Không tìm thấy phiếu phân công nào.</td>
                      </tr>
                    ) : (
                      dataPC.content.map(item => (
                        <tr 
                          key={item.maPhieuPhanCong} 
                          onClick={() => navigate("/nhanvien/phan-cong-phan-loai/" + item.maSuCo)}
                          className="clickable-row"
                          title="Nhấp để xem chi tiết phân công sự cố"
                        >
                          <td className="id-col">#{item.maPhieuPhanCong}</td>
                          <td className="title-col font-semibold">{item.tieuDe || "Không có tiêu đề"}</td>
                          <td className="addr-col text-muted">{item.diaDiem}</td>
                          <td>{getStatusBadge(item.trangThai)}</td>
                          <td className="date-col text-muted">{item.thoiGianTao}</td>
                          <td className="action-col">
                            <button className="btn-action-view" onClick={(e) => {
                              e.stopPropagation();
                              navigate("/nhanvien/phan-cong-phan-loai/" + item.maSuCo);
                            }}>
                              <Eye size={14} /> Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {dataPC && dataPC.pagination.totalPages > 1 && (
              <div className="pagination-row">
                <Pagination
                  currentPage={filterPC.page ?? 0}
                  totalPages={dataPC.pagination.totalPages}
                  totalElements={dataPC.pagination.totalElements}
                  pageSize={10}
                  onPageChange={(p) => setFilterPC(prev => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab content: Kiểm duyệt */}
      {activeTab === "kiem-duyet" && (
        <div className="tab-content-wrapper">
          <div className="filter-card">
            <div className="filter-header">
              <Filter size={16} />
              <span>Bộ lọc tìm kiếm</span>
            </div>
            <div className="lich-su-filter">
              <div className="filter-item">
                <label>Từ ngày</label>
                <div className="input-with-icon">
                  <Calendar size={14} />
                  <input
                    type="date"
                    value={filterKD.tuNgay ?? ""}
                    onChange={(e) => setFilterKD(p => ({ ...p, tuNgay: e.target.value || undefined, page: 0 }))}
                  />
                </div>
              </div>
              
              <div className="filter-item">
                <label>Đến ngày</label>
                <div className="input-with-icon">
                  <Calendar size={14} />
                  <input
                    type="date"
                    value={filterKD.denNgay ?? ""}
                    onChange={(e) => setFilterKD(p => ({ ...p, denNgay: e.target.value || undefined, page: 0 }))}
                  />
                </div>
              </div>

              <button className="btn-reset" onClick={handleResetKD}>Đặt lại bộ lọc</button>
            </div>
          </div>

          <div className="table-card">
            {loadingKD ? (
              <div className="lich-su-loading">
                <div className="kd-spinner" />
                <p>Đang tải lịch sử kiểm duyệt...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Mã phiếu</th>
                      <th>Tiêu đề sự cố</th>
                      <th>Địa điểm</th>
                      <th style={{ width: "180px" }}>Trạng thái</th>
                      <th style={{ width: "160px" }}>Thời gian duyệt</th>
                      <th style={{ width: "80px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!dataKD?.content.length ? (
                      <tr>
                        <td colSpan={6} className="no-data">Không tìm thấy phiếu kiểm duyệt nào.</td>
                      </tr>
                    ) : (
                      dataKD.content.map(item => (
                        <tr 
                          key={item.maKiemDuyet}
                          onClick={() => navigate("/nhanvien/kiem-duyet/" + item.maSuCo)}
                          className="clickable-row"
                          title="Nhấp để xem chi tiết kiểm duyệt sự cố"
                        >
                          <td className="id-col">#{item.maKiemDuyet}</td>
                          <td className="title-col font-semibold">{item.tieuDe || "Không có tiêu đề"}</td>
                          <td className="addr-col text-muted">{item.diaDiem}</td>
                          <td>{getStatusBadge(item.trangThai)}</td>
                          <td className="date-col text-muted">{item.thoiGianTao}</td>
                          <td className="action-col">
                            <button className="btn-action-view" onClick={(e) => {
                              e.stopPropagation();
                              navigate("/nhanvien/kiem-duyet/" + item.maSuCo);
                            }}>
                              <Eye size={14} /> Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {dataKD && dataKD.pagination.totalPages > 1 && (
              <div className="pagination-row">
                <Pagination
                  currentPage={filterKD.page ?? 0}
                  totalPages={dataKD.pagination.totalPages}
                  totalElements={dataKD.pagination.totalElements}
                  pageSize={10}
                  onPageChange={(p) => setFilterKD(prev => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LichSuPage;