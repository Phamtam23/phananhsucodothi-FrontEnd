import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MapPin, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TrangThaiPhanCong } from "../../../types/PhieuPhanCong";
import type { PhieuPhanCongWithSuCo } from "../../../hooks/phancong/usePhieuPhanCongDonVi";

export interface IncidentCardProps {
    incident: PhieuPhanCongWithSuCo;
    onAccept: () => void;
    onAssign: () => void;
    onViewDetail: (id: string | number) => void;
    isRejecting: boolean;
    rejectReason: string;
    setRejectReason: (r: string) => void;
    onStartReject: () => void;
    onCancelReject: () => void;
    onConfirmReject: () => void;
    isUpdating: boolean;
    onViewResult: () => void;
}

export const IncidentCard = ({
    incident,
    onAccept,
    onAssign,
    onViewDetail,
    isRejecting,
    rejectReason,
    setRejectReason,
    onStartReject,
    onCancelReject,
    onConfirmReject,
    isUpdating,
    onViewResult
}: IncidentCardProps) => {
    const navigate = useNavigate();
    const suco = incident.suCoDetail;
    
    const timeAgo = incident.thoiGianTao 
        ? formatDistanceToNow(new Date(incident.thoiGianTao), { addSuffix: true, locale: vi })
        : "";

    const loaiTag = "PHẢN ÁNH";

    const getStatusBadge = (status: TrangThaiPhanCong) => {
        switch (status) {
            case TrangThaiPhanCong.CHO_XAC_NHAN:
                return <span className="xac-minh-badge badge-warning">Chờ xác nhận</span>;
            case TrangThaiPhanCong.DA_XAC_NHAN:
                return <span className="xac-minh-badge badge-success">Đã tiếp nhận</span>;
            case TrangThaiPhanCong.TU_CHOI:
                return <span className="xac-minh-badge badge-danger">Đã từ chối</span>;
            case TrangThaiPhanCong.DANG_XU_LY:
                return <span className="xac-minh-badge badge-info">Đang xử lý</span>;
            case TrangThaiPhanCong.HOAN_THANH:
                return <span className="xac-minh-badge badge-success">Hoàn thành</span>;
            case TrangThaiPhanCong.CHO_DUYET_KET_QUA:
                return <span className="xac-minh-badge badge-warning">Chờ duyệt kết quả</span>;
            default:
                return <span className="xac-minh-badge badge-default">{status}</span>;
        }
    };

    return (
        <div className={`xac-minh-card ${isRejecting ? 'dang-tu-choi' : ''}`}>
            <div className="xac-minh-card-header">
                <div className="xac-minh-card-tags">
                    <span className="xac-minh-tag">{loaiTag}</span>
                    <span className="xac-minh-id">ID: #{incident.maSuCo}</span>
                </div>
                <span className="xac-minh-time">{timeAgo}</span>
            </div>
            
            <h3 className="xac-minh-card-title">{suco?.noiDung || "Không có tiêu đề"}</h3>
            
            {!isRejecting && (
                <>
                    <div className="xac-minh-card-meta">
                        <div className="xac-minh-meta-item">
                            <MapPin size={14} className="text-cam" />
                            <span>{suco?.diaDiem || "Không có địa chỉ"}</span>
                        </div>
                        <div className="xac-minh-meta-item">
                            <ImageIcon size={14} className="text-cam" />
                            <span>{suco?.medias?.length || 0} Ảnh đính kèm</span>
                        </div>
                    </div>
                    
                    {incident.trangThai === TrangThaiPhanCong.CHO_XAC_NHAN && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-tiep-nhan" onClick={onAccept} disabled={isUpdating}>
                                <div className="btn-icon">✓</div> Tiếp nhận
                            </button>
                            <button className="xac-minh-btn btn-tu-choi" onClick={onStartReject} disabled={isUpdating}>
                                <div className="btn-icon">✕</div> Từ chối
                            </button>
                            <button className="xac-minh-btn btn-detail" onClick={() => onViewDetail(incident.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}
                    
                    {incident.trangThai === TrangThaiPhanCong.DA_XAC_NHAN && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-phan-cong" onClick={onAssign}>
                                Phân công nhân sự
                            </button>
                            {/* New button to view detail of the incident */}
                            <button className="xac-minh-btn btn-detail" onClick={() => onViewDetail(incident.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}

                    {incident.trangThai === TrangThaiPhanCong.DANG_XU_LY && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-phan-cong" style={{backgroundColor: '#059669'}} onClick={onViewResult}>
                                Xem và Duyệt Kết Quả
                            </button>
                            <button className="xac-minh-btn btn-detail" onClick={() => onViewDetail(incident.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}

                    {incident.trangThai === TrangThaiPhanCong.CHO_DUYET_KET_QUA && (
                        <div className="xac-minh-card-actions">
                            <button 
                                className="xac-minh-btn btn-phan-cong" 
                                style={{ backgroundColor: '#f59e0b' }} 
                                onClick={() => navigate(`/truongdonvi/duyet-ket-qua/${incident.maPhieuPhanCong}`)}
                            >
                                Xem chi tiết để duyệt
                            </button>
                            <button className="xac-minh-btn btn-detail" onClick={() => onViewDetail(incident.maPhieuPhanCong)}>
                                Xem phân công
                            </button>
                        </div>
                    )}

                    {incident.trangThai === TrangThaiPhanCong.HOAN_THANH && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-detail" onClick={() => onViewDetail(incident.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}

                    {incident.trangThai !== TrangThaiPhanCong.CHO_XAC_NHAN && (
                        <div className="xac-minh-card-status-wrapper">
                            <span className="status-label">Trạng thái:</span>
                            {getStatusBadge(incident.trangThai)}
                        </div>
                    )}
                </>
            )}

            {isRejecting && (
                <div className="xac-minh-reject-form">
                    <label>LÝ DO TỪ CHỐI TIẾP NHẬN</label>
                    <textarea 
                        placeholder="Ví dụ: Phản ánh không đúng chuyên môn của đơn vị..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        disabled={isUpdating}
                    />
                    <div className="xac-minh-reject-actions">
                        <button className="xac-minh-btn-huy" onClick={onCancelReject} disabled={isUpdating}>
                            HỦY BỎ
                        </button>
                        <button className="xac-minh-btn-xac-nhan" onClick={onConfirmReject} disabled={isUpdating}>
                            XÁC NHẬN TỪ CHỐI
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
