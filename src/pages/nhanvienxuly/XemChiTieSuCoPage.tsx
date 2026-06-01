import { useParams } from "react-router-dom";
import DuyetKetQuaDetailPage from "../truongdonvi/DuyetKetQuaDetailPage";
const XemChiTieSuCoPage = () => {
       const {maPhieuPhanCong, maChiTietPhanCong, loai } = useParams();
       if (!maPhieuPhanCong || !loai) {
        return <div className="dkq-error-page">Thiếu thông tin cần thiết để hiển thị trang.</div>;
    }
       return (
              <DuyetKetQuaDetailPage  
              maPhieuPhanCong={maPhieuPhanCong}
              maChiTietPhanCong={maChiTietPhanCong}     
              loai={loai as any} />
       );
}

export default XemChiTieSuCoPage;