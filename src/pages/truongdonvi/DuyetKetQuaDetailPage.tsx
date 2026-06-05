import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import "./DuyetKetQuaDetailPage.scss";
import { usePhieuPhanCongDetail } from "../../hooks/phancong/usePhieuPhanCongDetail";
import { useDuyetKetQuaDetail } from "../../hooks/duyetketqua/useDuyetKetQuaDetail";
import DetailSuCo from "../../components/Suco/DetailSuCo";
import NopKetQuaForm from "../../components/NhanVienDonVi/XuLySuCo/NopKetQuaForm";
import DuyetKetQuaSidebar from "../../components/TruongDonVi/DuyetKetQua/DuyetKetQuaSidebar";
interface PropsDuyetKetQuaDetailPage {
    maPhieuPhanCong: string;
    maChiTietPhanCong?: string;
    loai: "DUYET_KET_QUA" | "DUYET_MO_LAI" | "NOP_KET_QUA" | "XEM_LICH_SU" | "XEM_CHI_TIET";
}

const DuyetKetQuaDetailPage = ({ maPhieuPhanCong, maChiTietPhanCong, loai }: PropsDuyetKetQuaDetailPage) => {
    const navigate = useNavigate();
    const { detail: phanCong, loading: dangTaiPhanCong } = usePhieuPhanCongDetail(maPhieuPhanCong);
    const [phieuNopKetQua, setPhieuNopKetQua] = useState<string | null>(null);

    const {
        danhSachCTPC, loading, dangXuLy,
        lyDoTuChoi, setLyDoTuChoi,
        duyetKetQua, tuChoiKetQua,
    } = useDuyetKetQuaDetail(maPhieuPhanCong || "");

    if (!maPhieuPhanCong) {
        return null;
    }

    if (dangTaiPhanCong) return <div className="dkq-loading-page">Đang tải thông tin...</div>;
    if (!phanCong) return <div className="dkq-error-page">Không tìm thấy thông tin phân công.</div>;

    const suCo = phanCong.suCoDetail;
    return (
        <div className="dkq-page">
            <header className="dkq-header">
                <div className="dkq-header-main">
                    <h1>Chi Tiết Phản Ánh & Duyệt Kết Quả</h1>
                    <p className="dkq-subtitle">
                        Đối chiếu và phê duyệt báo cáo xử lý hiện trường.
                    </p>
                </div>
            </header>

            <div className="dkq-content">

                {/* MAIN */}
                <div className="dkq-main-col">

                    <div className="dkq-suco-wrapper">
                        {suCo?.maSuCo ? (
                            <DetailSuCo maSuCo={suCo.maSuCo} />
                        ) : (
                            <div className="dkq-card">
                                <p className="dkq-empty-msg">
                                    Không tìm thấy thông tin sự cố.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {loai === "NOP_KET_QUA" && (
                    <div className="dkq-sidebar">
                        <div className="dkq-sidebar-card approval-card">
                            <h3>NỘP KẾT QUẢ XỬ LÝ</h3>
                            <p className="no-approval-msg">
                                Nhấn nút bên dưới để nộp kết quả xử lý cho công việc này.
                            </p>
                            <button
                                className="btn-approve"
                                onClick={() => setPhieuNopKetQua(maChiTietPhanCong || "")}
                            >
                                NỘP KẾT QUẢ
                            </button>
                        </div>
                    </div>
                )}

                {loai === "NOP_KET_QUA" && phieuNopKetQua && (
                    <NopKetQuaForm
                        maChiTietPhanCong={phieuNopKetQua}
                        onClose={() => setPhieuNopKetQua(null)}
                    />
                )}

                {loai === "DUYET_KET_QUA" && (
                    <DuyetKetQuaSidebar
                        danhSach={danhSachCTPC}
                        dangXuLy={dangXuLy}
                        lyDoTuChoi={lyDoTuChoi}
                        setLyDoTuChoi={setLyDoTuChoi}
                        duyetKetQua={duyetKetQua}
                        tuChoiKetQua={tuChoiKetQua}
                    />
                )}

            </div>
        </div>
    );
}
export default DuyetKetQuaDetailPage;