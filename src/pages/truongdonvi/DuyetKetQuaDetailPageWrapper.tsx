import { useParams } from "react-router-dom";
import DuyetKetQuaDetailPage from "./DuyetKetQuaDetailPage";

const DuyetKetQuaDetailPageWrapper = () => {
    const { id: maPhieuPhanCong } = useParams<{ id: string }>();
    if (!maPhieuPhanCong) return <div className="dkq-error-page">Không tìm thấy phiếu phân công.</div>;
    
    return (
        <DuyetKetQuaDetailPage
            maPhieuPhanCong={maPhieuPhanCong}
            loai="DUYET_KET_QUA" 
        />
    );
};

export default DuyetKetQuaDetailPageWrapper;