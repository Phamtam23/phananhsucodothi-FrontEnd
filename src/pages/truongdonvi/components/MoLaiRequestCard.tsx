import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import type { PhieuMoLaiResponse } from "../../../types/PhieuMoLai";

export interface MoLaiRequestCardProps {
    pml: PhieuMoLaiResponse;
    duyetLoading: boolean;
    rejectingMoLaiId: string | null;
    rejectMoLaiReason: string;
    setRejectingMoLaiId: (id: string | null) => void;
    setRejectMoLaiReason: (reason: string) => void;
    handleDuyetMoLai: (maPhieuMoLai: string, isApproved: boolean) => void;
}

export const MoLaiRequestCard = ({
    pml,
    duyetLoading,
    rejectingMoLaiId,
    rejectMoLaiReason,
    setRejectingMoLaiId,
    setRejectMoLaiReason,
    handleDuyetMoLai
}: MoLaiRequestCardProps) => {
    const navigate = useNavigate();

    return (
        <div className={`xac-minh-card ${rejectingMoLaiId === pml.maPhieuMoLai ? 'dang-tu-choi' : ''}`}>
            <div className="xac-minh-card-header">
                <div className="xac-minh-card-tags">
                    <span className="xac-minh-tag" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>YÊU CẦU MỞ LẠI</span>
                    <span className="xac-minh-id">Mã: #{pml.maPhieuMoLai}</span>
                </div>
                <span className="xac-minh-time">
                    {pml.thoiGianTao ? formatDistanceToNow(new Date(pml.thoiGianTao), { addSuffix: true, locale: vi }) : ""}
                </span>
            </div>

            <h3 className="xac-minh-card-title">{pml.noiDungSuCo || "Sự cố #" + pml.maSuCo}</h3>

            <div className="xac-minh-info-widget" style={{ marginBottom: 16, backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <div className="xac-minh-info-header">
                    <span className="xac-minh-widget-label" style={{ color: '#dc2626' }}>LÝ DO CỦA NGƯỜI DÂN:</span>
                </div>
                <p style={{ color: '#b91c1c', fontWeight: 500 }}>{pml.lyDo}</p>
            </div>

            {rejectingMoLaiId === pml.maPhieuMoLai ? (
                <div className="xac-minh-reject-form">
                    <label>LÝ DO TỪ CHỐI MỞ LẠI</label>
                    <textarea
                        placeholder="Nhập lý do từ chối yêu cầu này..."
                        value={rejectMoLaiReason}
                        onChange={(e) => setRejectMoLaiReason(e.target.value)}
                        disabled={duyetLoading}
                    />
                    <div className="xac-minh-reject-actions">
                        <button className="xac-minh-btn-huy" onClick={() => {
                            setRejectingMoLaiId(null);
                            setRejectMoLaiReason("");
                        }} disabled={duyetLoading}>
                            HỦY BỎ
                        </button>
                        <button className="xac-minh-btn-xac-nhan" onClick={() => handleDuyetMoLai(pml.maPhieuMoLai, false)} disabled={duyetLoading}>
                            XÁC NHẬN TỪ CHỐI
                        </button>
                    </div>
                </div>
            ) : (
                <div className="xac-minh-card-actions">
                    <button className="xac-minh-btn btn-phan-cong" style={{ backgroundColor: '#059669', width: 'auto' }} onClick={() => handleDuyetMoLai(pml.maPhieuMoLai, true)} disabled={duyetLoading}>
                        <div className="btn-icon">✓</div> Duyệt Mở Lại
                    </button>
                    <button className="xac-minh-btn btn-tu-choi" onClick={() => setRejectingMoLaiId(pml.maPhieuMoLai)} disabled={duyetLoading}>
                        <div className="btn-icon">✕</div> Từ chối
                    </button>
                    {pml.maPhieuPhanCong && (
                        <button className="xac-minh-btn btn-detail" onClick={() => navigate(`/truongdonvi/phan-cong/${pml.maPhieuPhanCong}`)} disabled={duyetLoading}>
                            Xem chi tiết
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
