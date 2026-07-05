import "./LichSuSuCo.scss";
import { useLichSuSuCo } from "../../../hooks/suco/useLichSuSuCo";
import SuCoCard from "../../../components/Suco/SuCoCard";
import Pagination from "../../../components/Page/Pagination"
import { useNavigate } from "react-router-dom";
const LichSuSuCo = () => {

    const navigate = useNavigate();
    
    const handleCardClick = (maSuCo: string) => {
        navigate(`/suco/detail/${maSuCo}`);
    };
    const { loading, error, sucoList, pagination, setPage, page } = useLichSuSuCo();
    if (loading) {
        return <div>Đang tải...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

  return (
    <div className="lich-su-su-co">
        <h2>Lịch sử sự cố</h2>
        {sucoList.length === 0 ? (
            <p>Không có dữ liệu</p>

        ):(
         <div className="suco-list">
      {sucoList.map((suco) => (
        <SuCoCard key={suco.maSuCo} suco={suco} onClick={handleCardClick} />
        ))}
        </div>
            )}

       
            <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
            />

    </div>

    );

}

export default LichSuSuCo;