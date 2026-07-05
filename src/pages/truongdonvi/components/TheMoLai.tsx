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
                    <span className="xac-minh-tag" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                        YÊU CẦU MỞ LẠI
                    </span>
                    <span className="xac-minh-id">Mã: #{phieuMoLai.maPhieuMoLai}</span>
                </div>
                <span className="xac-minh-time">{thoiGianTruoc}</span>
            </div>

            <h3 className="xac-minh-card-title">
                {phieuMoLai.noiDungSuCo || "Sự cố #" + phieuMoLai.maSuCo}
            </h3>

            <div className="xac-minh-info-widget" style={{ marginBottom: 16, backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <div className="xac-minh-info-header">
                    <span className="xac-minh-widget-label" style={{ color: '#dc2626' }}>
                        LÝ DO CỦA NGƯỜI DÂN:
                    </span>
                </div>
                <p style={{ color: '#b91c1c', fontWeight: 500 }}>{phieuMoLai.lyDo}</p>
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
                    <button
                        className="xac-minh-btn btn-phan-cong"
                        style={{ backgroundColor: '#059669', width: 'auto' }}
                        onClick={() => onDuyetMoLai(phieuMoLai.maPhieuMoLai, true)}
                        disabled={dangDuyet}
                    >
                        <div className="btn-icon">✓</div> Duyệt Mở Lại
                    </button>
                    <button
                        className="xac-minh-btn btn-tu-choi"
                        onClick={() => setIdDangTuChoi(phieuMoLai.maPhieuMoLai)}
                        disabled={dangDuyet}
                    >
                        <div className="btn-icon">✕</div> Từ chối
                    </button>
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