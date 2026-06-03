import "./LichSuSuCo.scss";
import { useLichSuSuCo } from "../../../hooks/suco/useLichSuSuCo";
import type { TrangThaiSuCo } from "../../../types/Suco";
import SuCoCard from "../../../components/Suco/SuCoCard";
import Pagination from "../../../components/Page/Pagination"
import { useNavigate } from "react-router-dom";
const LichSuSuCo = () => {

    const navigate = useNavigate();
    
    const handleCardClick = (maSuCo: string) => {
        navigate(`/suco/detail/${maSuCo}`);
    };

    const handleBoSungClick = (maSuCo: string) => {
        navigate(`/suco/update/${maSuCo}`);
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
    } = useLichSuSuCo();
    if (loading) {
        return <div>Đang tải...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

  const statusOptions = [
    { value: "tat_ca", label: "Tất cả" },
    { value: "CHO_TIEP_NHAN", label: "Chờ tiếp nhận" },
    { value: "DA_TIEP_NHAN", label: "Đã duyệt" },
    { value: "BO_SUNG", label: "Yêu cầu bổ sung" },
    { value: "DA_XU_LY_XONG", label: "Hoàn thành" },
    { value: "TU_CHOI", label: "Từ chối" },
  ];

  const activeStatus = sucoFilter.trangThai?.[0] ?? "tat_ca";

  return (
    <div className="lich-su-su-co">
        <h2>Lịch sử sự cố</h2>
        <div className="lich-su-su-co__status-tabs">
          {statusOptions.map((option) => {
            const isActive = activeStatus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`lich-su-su-co__status-pill ${isActive ? "active" : ""}`}
                onClick={() => setSucoFilter(prev => ({
                  ...prev,
                  trangThai: option.value !== "tat_ca" 
                    ? [option.value as TrangThaiSuCo]
                    : undefined,
                }))}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {danhSachSuCo.length === 0 ? (
            <p>Không có dữ liệu</p>

        ):(
         <div className="suco-list">
            {danhSachSuCo.map((suco) => (
                <SuCoCard key={suco.maSuCo} type="lich-su" suco={suco} onClick={handleCardClick} onBoSungClick={handleBoSungClick} />
                ))}
                </div>
         )}

       
    <Pagination currentPage={currentPage} totalPages={totalPages}   totalElements={totalElements} onPageChange={setCurrentPage} />

    </div>

   ) }


export default LichSuSuCo;