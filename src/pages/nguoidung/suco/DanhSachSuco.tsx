import {useState} from "react"
import SuCoCard from "../../../components/Suco/SuCoCard";
import { useDanhSachSuco } from "../../../hooks/suco/useDanhSachSuco";
import {useNavigate} from "react-router-dom";
import "./DanhSachSuco.scss";
import Pagination from "../../../components/Page/Pagination"
import type { TrangThaiSuCo } from "../../../types/Suco";
const DanhSachSuCo = () => {
    const navigate = useNavigate();
    const [keywordInput, setKeywordInput] = useState("");
    const [diaDiemInput, setDiaDiemInput] = useState("");
    const handleCardClick = (maSuCo: string) => {
        navigate(`/suco/detail/${maSuCo}`);
    };
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
    danhSachLoai
  } = useDanhSachSuco();
    
    if (loading) {
        return <div>Đang tải...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

      const handleSearch = () => {
        setSucoFilter(prev => ({
            ...prev,
            keyword: keywordInput.trim() || undefined,
            diaDiem: diaDiemInput.trim() || undefined,
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };


    return (
        <div className="danh-sach-su-co">

            <h2>Danh sách sự cố</h2>
              <h2>Danh sách sự cố</h2>
              <p className="subtitle">Hệ thống lưu trữ và giám sát các phản ánh cộng đồng theo tiêu chuẩn đô thị hiện đại.</p>
            <div className="filter-group" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <select
              value={sucoFilter.trangThai?.[0] ?? "tat_ca"}  // ✅ fix
              onChange={e => setSucoFilter(prev => ({ 
                ...prev, 
                trangThai: e.target.value !== "tat_ca" 
                  ? [e.target.value as TrangThaiSuCo]  
                  : undefined 
              }))}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f1f3f4' }}
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="CHO_TIEP_NHAN">Chờ tiếp nhận</option>
              <option value="DA_TIEP_NHAN">Đã tiếp nhận</option>
              <option value="DANG_XU_LY">Đang xử lý</option>
            </select>

            <select
              value={sucoFilter.maLoai ?? "tat_ca"}
              onChange={e => setSucoFilter(prev => ({ 
                ...prev, 
                maLoai: e.target.value !== "tat_ca"  
                  ? e.target.value  
                  : undefined 
              }))}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f1f3f4' }}
            >
              <option value="tat_ca">Tất cả loại sự cố</option>
              {danhSachLoai.map(loai => (
                <option key={loai.maLoai} value={loai.maLoai}>{loai.tenLoaiSuCo}</option>
              ))}
            </select>

             <div className="filter-row">
                    <div className="filter-input-wrapper">
                        <span className="filter-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm theo tên sự cố..."
                            value={keywordInput}
                            onChange={e => setKeywordInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="filter-input-wrapper">
                        <span className="filter-icon">📍</span>
                        <input
                            type="text"
                            placeholder="Tìm theo địa điểm..."
                            value={diaDiemInput}
                            onChange={e => setDiaDiemInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button className="filter-search-btn" onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>
          </div>
            {danhSachSuCo.length === 0 ? (
                <p>Không có dữ liệu</p>
            ) : (
             <div className="list-su-co">
                {danhSachSuCo.map((suco) => {
                    return <SuCoCard key={suco.maSuCo} suco={suco} onClick={handleCardClick} />
                })}

                 </div>   
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages}   totalElements={totalElements} onPageChange={setCurrentPage} />
        </div>
    );

}

export default DanhSachSuCo;