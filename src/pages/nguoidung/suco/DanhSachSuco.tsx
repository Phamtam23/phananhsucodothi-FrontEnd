import SuCoCard from "../../../components/Suco/SuCoCard";
import { useDanhSachSuco } from "../../../hooks/suco/useDanhSachSuco";
import {useNavigate} from "react-router-dom";
import "./DanhSachSuco.scss";
import Pagination from "../../../components/Page/Pagination"
const DanhSachSuCo = () => {
    const navigate = useNavigate();

    const handleCardClick = (maSuCo: string) => {
        navigate(`/suco/detail/${maSuCo}`);
    };
    
    const { loading, error, sucoList, pagination, setPage } = useDanhSachSuco();
    
    if (loading) {
        return <div>Đang tải...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }

    
    return (
        <div className="danh-sach-su-co">
            <h2>Danh sách sự cố</h2>

            {sucoList.length === 0 ? (
                <p>Không có dữ liệu</p>
            ) : (
             <div className="list-su-co">
                {sucoList.map((suco) => {
                    return <SuCoCard key={suco.maSuCo} suco={suco} onClick={handleCardClick} />
                })}

                 </div>   
            )}
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages}   totalElements={pagination.totalElements} onPageChange={setPage} />
        </div>
    );

}

export default DanhSachSuCo;