import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import type { PhieuMoLaiResponse } from "../../../types/PhieuMoLai";

export interface PropsTheYeuCauMoLai {
    phieuMoLai: PhieuMoLaiResponse;
    dangDuyet: boolean;
    idDangTuChoi: string | null;
    lyDoTuChoi: string;
    setIdDangTuChoi: (id: string | null) => void;
    setLyDoTuChoi: (lyDo: string) => void;
    onDuyetMoLai: (maPhieuMoLai: string, chapNhan: boolean) => void;
}

export const TheMoLai = ({
    phieuMoLai,
    dangDuyet,
    idDangTuChoi,
    lyDoTuChoi,
    setIdDangTuChoi,
    setLyDoTuChoi,
    onDuyetMoLai
}: PropsTheYeuCauMoLai) => {
    const navigate = useNavigate();

    const thoiGianTruoc = phieuMoLai.thoiGianTao
        ? formatDistanceToNow(new Date(phieuMoLai.thoiGianTao), { addSuffix: true, locale: vi })
        : "";

    const dangTuChoiPhieu = idDangTuChoi === phieuMoLai.maPhieuMoLai;

    const huyTuChoi = () => {
        setIdDangTuChoi(null);
        setLyDoTuChoi("");
    };

    return (
        <div className={`xac-minh-card ${dangTuChoiPhieu ? 'dang-tu-choi' : ''}`}>
            <div className="xac-minh-card-header">
                <div className="xac-minh-card-tags">
                    <span className="xac-minh-tag" style={{ backgroundColor: '#fffbeb', color: '#d97706', borderColor: '#fde68a' }}>
                        YÊU CẦU MỞ LẠI
                    </span>
                    <span className="xac-minh-id">Mã: #{phieuMoLai.maPhieuMoLai}</span>
                </div>
                <span className="xac-minh-time">{thoiGianTruoc}</span>
            </div>

            <h3 className="xac-minh-card-title">
                {phieuMoLai.noiDungSuCo || "Sự cố #" + phieuMoLai.maSuCo}
            </h3>

            <div className="xac-minh-info-widget" style={{ marginBottom: 16, backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div className="xac-minh-info-header">
                    <span className="xac-minh-widget-label" style={{ color: '#0369a1' }}>
                        LÝ DO CỦA NGƯỜI DÂN:
                    </span>
                </div>
                <p style={{ color: '#0f172a', fontWeight: 500 }}>{phieuMoLai.lyDo}</p>
            </div>

            {dangTuChoiPhieu ? (
                <div className="xac-minh-reject-form">
                    <label>LÝ DO TỪ CHỐI MỞ LẠI</label>
                    <textarea
                        placeholder="Nhập lý do từ chối yêu cầu này..."
                        value={lyDoTuChoi}
                        onChange={(e) => setLyDoTuChoi(e.target.value)}
                        disabled={dangDuyet}
                    />
                    <div className="xac-minh-reject-actions">
                        <button className="xac-minh-btn-huy" onClick={huyTuChoi} disabled={dangDuyet}>
                            HỦY BỎ
                        </button>
                        <button className="xac-minh-btn-xac-nhan" onClick={() => onDuyetMoLai(phieuMoLai.maPhieuMoLai, false)} disabled={dangDuyet}>
                            XÁC NHẬN TỪ CHỐI
                        </button>
                    </div>
                </div>
            ) : (
                <div className="xac-minh-card-actions">
                    {phieuMoLai.maPhieuPhanCong && (
                        <button
                            className="xac-minh-btn btn-detail"
                            onClick={() => navigate(`/truongdonvi/duyet-mo-lai/${phieuMoLai.maPhieuMoLai}`)}
                            disabled={dangDuyet}
                        >
                            Xem chi tiết
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};