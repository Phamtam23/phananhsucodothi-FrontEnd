import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ListFilter, MoreHorizontal, CheckCircle2 } from "lucide-react";
import "./KiemDuyetPage.scss";
import {useKiemDuyetPage} from "../../../hooks/kiemDuyet/useKiemDuyetPage";
import KiemDuyetTable from "../../../components/Table/KiemDuyetTable";
import Pagination from "../../../components/Page/Pagination";
import PhanCongPhanLoaiDetail from "./PhanCongPhanLoaiDetail";
type TrangThaiFilter = "tat_ca" | "CHO_TIEP_NHAN" | "DA_TIEP_NHAN" | "TU_CHOI";

const TRANG_THAI_FILTERS: { value: TrangThaiFilter; label: string }[] = [
  { value: "tat_ca", label: "Tất cả trạng thái" },
  { value: "CHO_TIEP_NHAN", label: "Chờ tiếp nhận" },
  { value: "DA_TIEP_NHAN", label: "Đã tiếp nhận" },
  { value: "TU_CHOI", label: "Từ chối" },
];

const KiemDuyetPage = () => {
  const navigate = useNavigate();

  const {
    data,
    totalElements,
    totalPages,
    currentPage,
    setCurrentPage,
    trangThaiFilter,
    setTrangThaiFilter,
    searchCode,
    setSearchCode,
    searchLocation,
    setSearchLocation,
    loading,
    error
  } = useKiemDuyetPage();

 

  const handleRowClick = (maSuCo: string) => {
    navigate(`/nhanvien/kiem-duyet/${maSuCo}`);
  };

  const filteredData = data.filter(item => {
    const codeMatch = !searchCode || (item.maSuCo && item.maSuCo.toLowerCase().includes(searchCode.toLowerCase()));
    const locMatch = !searchLocation || (item.diaDiem && item.diaDiem.toLowerCase().includes(searchLocation.toLowerCase()));
    return codeMatch && locMatch;
  });

  return (
    <div className="kd-page">
      {/* Summary Cards */}
      <div className="kd-summary-cards">
        <div className="kd-card">
          <div className="kd-card-content">
            <span className="kd-card-title">Tổng sự cố</span>
            <div className="kd-card-value">
              1,284
              <span className="kd-badge-tag">+12%</span>
            </div>
          </div>
        </div>

        <div className="kd-card">
          <div className="kd-card-content">
            <span className="kd-card-title">Chờ duyệt</span>
            <div className="kd-card-value">42</div>
          </div>
          <div className="kd-card-icon orange">
            <MoreHorizontal size={24} />
          </div>
        </div>

        <div className="kd-card">
          <div className="kd-card-content">
            <span className="kd-card-title">Đã xử lý</span>
            <div className="kd-card-value">1,120</div>
          </div>
          <div className="kd-card-icon black">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="kd-table-wrapper">
        {/* Filter Bar */}
        <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
          <div className="kd-filter-bar">
            <div className="kd-filter-input-wrap">
              <Search />
              <input
                placeholder="Mã sự cố..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>

            <div className="kd-filter-input-wrap">
              <MapPin />
              <input
                placeholder="Vị trí/Quận..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <div className="kd-filter-input-wrap">
              <Calendar />
              <input
                placeholder="Khoảng ngày..."
                readOnly
              />
            </div>

            <div className="kd-filter-input-wrap">
              <ListFilter />
              <select
                className="kd-filter-select"
                value={trangThaiFilter}
                onChange={(e) => {
                  setTrangThaiFilter(e.target.value as TrangThaiFilter);
                  setCurrentPage(0);
                }}
              >
                {TRANG_THAI_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="kd-state-box">
            <div className="kd-spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="kd-state-box error">
            <p>{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="kd-state-box">
            <p>Không có sự cố nào.</p>
          </div>
        ) : (
          <KiemDuyetTable data={filteredData} onRowClick={handleRowClick} />
        )}
       <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={10}
        onPageChange={setCurrentPage}
      />
      </div>
    </div>
  );
};

export default KiemDuyetPage;