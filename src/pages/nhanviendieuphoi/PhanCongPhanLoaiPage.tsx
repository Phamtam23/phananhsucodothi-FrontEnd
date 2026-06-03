import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  Info,
  Clock,
  Layers
} from "lucide-react";
import "./PhanCongPhanLoaiPage.scss";
import { useKiemDuyetPage } from "../../hooks/kiemDuyet/useKiemDuyetPage";
import KiemDuyetCardList from "../../components/Table/KiemDuyetCardList";
import Pagination from "../../components/Page/Pagination";
import type { SucoSumaryResponse } from "../../types/Suco";
import { TrangThaiSuCo } from "../../types/Suco";
import { GetAllLoaiService } from "../../services/LoaiService";
import type { LoaiResponse } from "../../types/Loai";

const PhanCongPhanLoaiPage = () => {
  const navigate = useNavigate();
  const {
    danhSachSuCo,
    loading,
    error,
    currentPage,
    totalElements,
    totalPages,
    setCurrentPage,
    sucoFilter,
    setSucoFilter,
    fetchDanhSachSuCo
  } = useKiemDuyetPage();

  // Tab state
  const [activeTab, setActiveTab] = useState<"TAT_CA" | "CHO_PHAN_CONG" | "DA_PHAN_CONG">("TAT_CA");

  // Filter form states
  const [keyword, setKeyword] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("");
  const [loaiList, setLoaiList] = useState<LoaiResponse[]>([]);

  const TABS = [
    { label: "Tất cả", value: "TAT_CA" },
    { label: "Chờ phân công", value: "CHO_PHAN_CONG" },
    { label: "Đã phân công", value: "DA_PHAN_CONG" },
  ] as const;

  // Real "DA_PHAN_CONG" statuses: processing, processed or closed (excludes DA_TIEP_NHAN, which is "Chờ phân công")
  const DA_PHANCONG_STATUSES = [
    TrangThaiSuCo.DANG_XU_LY,
    TrangThaiSuCo.DA_XU_LY_XONG,
    TrangThaiSuCo.DA_DONG,
  ];

  // Fetch categories on mount
  useEffect(() => {
    GetAllLoaiService()
      .then((res) => {
        if (res.status === 200 && res.data) {
          setLoaiList(res.data);
        }
      })
      .catch((err) => console.error("Lỗi lấy danh mục loại sự cố:", err));
  }, []);

  // Sync activeTab state changes to sucoFilter.trangThai
  const handleTabChange = (tabValue: typeof activeTab) => {
    setActiveTab(tabValue);
    
    setSucoFilter((prev) => {
      let trangThai: TrangThaiSuCo[] | undefined = undefined;
      if (tabValue === "CHO_PHAN_CONG") {
        trangThai = [TrangThaiSuCo.DA_TIEP_NHAN];
      } else if (tabValue === "DA_PHAN_CONG") {
        trangThai = DA_PHANCONG_STATUSES;
      }
      
      return {
        ...prev,
        trangThai
      };
    });
  };

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSucoFilter((prev) => ({
      ...prev,
      keyword: keyword.trim() || undefined,
      maLoai: selectedLoai || undefined
    }));
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedLoai("");
    setSucoFilter((prev) => ({
      ...prev,
      keyword: undefined,
      maLoai: undefined
    }));
  };

  const handleRowClick = (item: SucoSumaryResponse) => {
    navigate("/nhanvien/phan-cong/" + item.maSuCo);
  };

  return (
    <div className="pc-page">
      {/* Header section with Stats */}
      <div className="pc-header-section">
        <div className="pc-title-box">
          <h2>Danh sách phân công & phân loại</h2>
          <p>Phân loại loại hình sự cố và điều phối, phân công các đơn vị xử lý khắc phục.</p>
        </div>

        <div className="pc-summary-cards">
          <div className="pc-card">
            <div className="pc-card-content">
              <span className="pc-card-title">Kết quả lọc</span>
              <div className="pc-card-value">
                {totalElements}
                <span className="pc-card-subtext">sự cố tìm thấy</span>
              </div>
            </div>
            <div className="pc-card-icon blue">
              <Layers size={20} />
            </div>
          </div>

          <div className="pc-card">
            <div className="pc-card-content">
              <span className="pc-card-title">Quy trình</span>
              <div className="pc-card-value">Điều phối</div>
              <span className="pc-card-subtext">Phân loại &gt; Chọn đơn vị</span>
            </div>
            <div className="pc-card-icon orange">
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs and Filters Container */}
      <div className="pc-filter-container">
        {/* Navigation Tabs */}
        <div className="kd-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`kd-tab-button ${activeTab === tab.value ? "active" : ""}`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <form className="pc-filter-bar" onSubmit={handleApplyFilters}>
          <div className="pc-filter-input-wrap search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, nội dung..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="pc-filter-input-wrap">
            <select
              className="pc-filter-select"
              value={selectedLoai}
              onChange={(e) => setSelectedLoai(e.target.value)}
            >
              <option value="">Tất cả loại sự cố</option>
              {loaiList.map((loai) => (
                <option key={loai.maLoai} value={loai.maLoai}>
                  {loai.tenLoaiSuCo}
                </option>
              ))}
            </select>
          </div>

          <div className="pc-filter-actions">
            <button type="submit" className="btn-filter-submit">
              <Filter size={16} /> Lọc kết quả
            </button>
            <button type="button" className="btn-filter-reset" onClick={handleResetFilters}>
              Đặt lại
            </button>
          </div>
        </form>
      </div>

      {/* Main Table Wrapper / Card Grid */}
      <div className="pc-table-wrapper">
        {loading ? (
          <div className="kd-state-box">
            <div className="kd-spinner" />
            <p>Đang tải danh sách sự cố...</p>
          </div>
        ) : error ? (
          <div className="kd-state-box error">
            <AlertTriangle size={32} />
            <p>{error}</p>
            <button className="btn-retry" onClick={() => fetchDanhSachSuCo(currentPage, 10, sucoFilter)}>
              <RefreshCw size={14} /> Thử lại
            </button>
          </div>
        ) : danhSachSuCo.length === 0 ? (
          <div className="kd-state-box empty">
            <Info size={32} />
            <p>Không tìm thấy sự cố nào cần điều phối ở bộ lọc hiện tại.</p>
          </div>
        ) : (
          <KiemDuyetCardList
            data={danhSachSuCo}
            onRowClick={handleRowClick}
            loai="PHAN_CONG"
          />
        )}

        {totalPages > 1 && (
          <div className="pc-pagination-row">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhanCongPhanLoaiPage;