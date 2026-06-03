import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  Info
} from "lucide-react";

import "./KiemDuyetPage.scss";
import { useDanhSachSuco } from "../../hooks/suco/useDanhSachSuco";
import KiemDuyetCardList from "../../components/Table/KiemDuyetCardList";
import Pagination from "../../components/Page/Pagination";
import type { SucoSumaryResponse } from "../../types/Suco";
import { TrangThaiSuCo } from "../../types/Suco";
import {usePhieuKiemDuyet} from "../../hooks/nhanviendieuphoi/usePhieuKiemDuyet";
import { TrangThaiKiemDuyet } from "../../types/PhieuKiemDuyet";

const KiemDuyetPage = () => {
  const navigate = useNavigate();
  const {
    danhSachSuCo,
    loading,
    error,
    danhSachLoai,
    currentPage,
    totalElements,
    totalPages,
    setCurrentPage,
    sucoFilter,
    setSucoFilter,
    fetchDanhSachSuCo
  } = useDanhSachSuco();

  const [keyword, setKeyword] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("");

  const [activeTab, setActiveTab] = useState<"TAT_CA" | "CHO_TIEP_NHAN" | "TU_CHOI" | "BO_SUNG" | "DA_DUYET">("TAT_CA");

  const {createPhieuKiemDuyet} = usePhieuKiemDuyet();

  const TABS = [
    { label: "Tất cả", value: "TAT_CA" },
    { label: "Chờ duyệt", value: "CHO_TIEP_NHAN" },
    { label: "Từ chối", value: "TU_CHOI" },
    { label: "Bổ sung", value: "BO_SUNG" },
    { label: "Đã duyệt", value: "DA_DUYET" },
  ] as const;

  const DA_DUYET_STATUSES = [
    TrangThaiSuCo.DANG_XU_LY,
    TrangThaiSuCo.DA_XU_LY_XONG,
    TrangThaiSuCo.DA_TIEP_NHAN,
    TrangThaiSuCo.DA_DONG,
  ];

    const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSucoFilter((prev) => ({
      ...prev,
      keyword: keyword.trim() || undefined,
      maLoai: selectedLoai || undefined
    }));
  };

  const handleCreatePhieuKiemDuyet = (maSuCo: string,trangThai: TrangThaiKiemDuyet ,lyDo : string) => {
    createPhieuKiemDuyet({
      maSuCo,
      trangThaiKiemDuyet: trangThai,
      lyDoTuChoi: lyDo
    })
    .then((res) => {
      if (res.maKiemDuyet) {
        alert("Tạo phiếu kiểm duyệt thành công!");
        fetchDanhSachSuCo(currentPage, 10, sucoFilter);
      } else {
        alert("Có lỗi xảy ra khi tạo phiếu kiểm duyệt.");
      }
    })
    .catch((err) => {
      console.error("Lỗi tạo phiếu kiểm duyệt:", err);
      alert("Có lỗi xảy ra khi tạo phiếu kiểm duyệt.");
    });

  }

   const handleResetFilters = () => {
    setKeyword("");
    setSelectedLoai("");
    setSucoFilter((prev) => ({
      ...prev,
      keyword: undefined,
      maLoai: undefined
    }));
  };

  const handleTabChange = (tabValue: typeof activeTab) => {
    setActiveTab(tabValue);
    
    setSucoFilter((prev) => {
      let trangThai: TrangThaiSuCo[] | undefined = undefined;
      if (tabValue === "CHO_TIEP_NHAN") {
        trangThai = [TrangThaiSuCo.CHO_TIEP_NHAN];
      } else if (tabValue === "TU_CHOI") {
        trangThai = [TrangThaiSuCo.TU_CHOI];
      } else if (tabValue === "BO_SUNG") {
        trangThai = [TrangThaiSuCo.BO_SUNG];
      } else if (tabValue === "DA_DUYET") {
        trangThai = DA_DUYET_STATUSES;
      }
      
      return {
        ...prev,
        trangThai
      };
    });
  };

  const handleRowClick = (item: SucoSumaryResponse) => {
    navigate(`/nhanvien/kiem-duyet/${item.maSuCo}`);
  };


  return (
    <div className="kd-page">

      <div className="kd-filter-container">
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
              {danhSachLoai.map((loai) => (
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
      <div className="kd-table-wrapper">
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
            <p>Không tìm thấy sự cố nào trùng khớp với bộ lọc.</p>
          </div>
        ) : (
          <KiemDuyetCardList
            loai="KIEM_DUYET"
            data={danhSachSuCo}
            onRowClick={handleRowClick}
            onKiemDuyet={handleCreatePhieuKiemDuyet}
          />
        )}

        {totalPages > 1 && (
          <div className="kd-pagination-row">
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


    </div>
  );
}

export default KiemDuyetPage;