import { useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Globe,
  Share2,
  Mail
} from "lucide-react";
import Pagination from "../../../components/Page/Pagination";
import heroBg from "../../../assets/Header - Hero Section.png";
import "./PhanAnhCongDong.scss";
import SuCoCard from "../../../components/Suco/SuCoCard";
import { useDanhSachSuco } from "../../../hooks/suco/useDanhSachSuco";
import type { TrangThaiSuCo } from "../../../types/Suco";
const PhanAnhCongDongPage = () => {
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
    danhSachLoai
  } = useDanhSachSuco();  
  const [keywordInput, setKeywordInput] = useState("");
  const [tongSo, setTongSo] = useState(0);
  const [showTrangThaiMenu, setShowTrangThaiMenu] = useState(false);
   const [diaDiemInput, setDiaDiemInput] = useState("");
  const goDetail = (maSuCo: string) => {
    navigate(`/suco/detail/${maSuCo}`);
  };

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
  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="pacd">
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
      <div className="pacd__toolbar">
        <div className="pacd__toolbar-inner">
          <div className="pacd__search">
            <Search size={15} />
            <input
              placeholder="Tìm kiếm phản ánh theo từ khóa, địa chỉ..."
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
                <select className="pacd__select"
              value={sucoFilter.maLoai ?? "tat_ca"}
              onChange={e => setSucoFilter(prev => ({ 
                ...prev, 
                maLoai: e.target.value !== "tat_ca"  
                  ? e.target.value  
                  : undefined 
              }))}
            >
              <option value="tat_ca">Tất cả loại sự cố</option>
              {danhSachLoai.map(loai => (
                <option key={loai.maLoai} value={loai.maLoai}>{loai.tenLoaiSuCo}</option>
              ))}
          </select>
       
           <select className="pacd__select"
              value={sucoFilter.trangThai?.[0] ?? "tat_ca"}  
              onChange={e => setSucoFilter(prev => ({ 
                ...prev, 
                trangThai: e.target.value !== "tat_ca" 
                  ? [e.target.value as TrangThaiSuCo]  
                  : undefined 
              }))}
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="CHO_TIEP_NHAN">Chờ tiếp nhận</option>
              <option value="DA_TIEP_NHAN">Đã tiếp nhận</option>
              <option value="DANG_XU_LY">Đang xử lý</option>
            </select>

          {/* Hiển thị số lượng */}
          <div className="pacd__count">
            Hiển thị <strong>{danhSachSuCo.length}</strong> / {tongSo } phản ánh
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
      <div className="pacd__content">
              {danhSachSuCo.length === 0 ? (
                <p>Không có dữ liệu</p>
            ) : (
             <div className="list-su-co">
                {danhSachSuCo.map((suco) => {
                    return <SuCoCard key={suco.maSuCo} suco={suco} onClick={goDetail} />
                })}

                 </div>   
            )}
             <Pagination currentPage={currentPage} totalPages={totalPages}   totalElements={totalElements} onPageChange={setCurrentPage} />
 
    </div>
    </div>
  );
};

export default PhanAnhCongDongPage;
