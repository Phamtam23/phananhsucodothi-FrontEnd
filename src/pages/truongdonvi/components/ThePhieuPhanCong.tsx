import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MapPin, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TrangThaiPhanCong } from "../../../types/PhieuPhanCong";
import type { PhieuPhanCongWithSuCo } from "../../../hooks/phancong/usePhieuPhanCongDonVi";
import "./ThePhieuPhanCong.scss";
export interface PropsThePhieuPhanCong {
    phieu: PhieuPhanCongWithSuCo;
    onChapNhan: () => void;
    onPhanCong: () => void;
    onXemChiTiet: (id: string | number) => void;
    dangTuChoi: boolean;
    lyDoTuChoi: string;
    setLyDoTuChoi: (r: string) => void;
    onBatDauTuChoi: () => void;
    onHuyTuChoi: () => void;
    onXacNhanTuChoi: () => void;
    dangCapNhat: boolean;
    onXemKetQua: () => void;
}

export const ThePhieuPhanCong = ({
    phieu,
    onChapNhan,
    onPhanCong,
    onXemChiTiet,
    dangTuChoi,
    lyDoTuChoi,
    setLyDoTuChoi,
    onBatDauTuChoi,
    onHuyTuChoi,
    onXacNhanTuChoi,
    dangCapNhat,
    onXemKetQua
}: PropsThePhieuPhanCong) => {
    const navigate = useNavigate();
    const suCo = phieu.suCoDetail;

    const thoiGianTruoc = phieu.thoiGianTao
        ? formatDistanceToNow(new Date(phieu.thoiGianTao), { addSuffix: true, locale: vi })
        : "";

    const nhanTrangThai = (trangThai: TrangThaiPhanCong) => {
        switch (trangThai) {
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
                return <span className="xac-minh-badge badge-default">{trangThai}</span>;
        }
    };

    return (
        <div className={`xac-minh-card ${dangTuChoi ? 'dang-tu-choi' : ''}`}>
            <div className="xac-minh-card-header">
                <div className="xac-minh-card-tags">
                    <span className="xac-minh-tag">PHẢN ÁNH</span>
                    <span className="xac-minh-id">ID: #{phieu.maSuCo}</span>
                </div>
                <span className="xac-minh-time">{thoiGianTruoc}</span>
            </div>

            <h3 className="xac-minh-card-title">{suCo?.noiDung || "Không có tiêu đề"}</h3>
               <div className="xac-minh-card-meta">
                        <div className="xac-minh-meta-box">
                            <MapPin size={16} className="text-cam" />
                            <span>{suCo?.diaDiem || "Không có địa chỉ"}</span>
                        </div>
                        <div className="xac-minh-meta-box">
                            <ImageIcon size={16} className="text-cam" />
                            <span>{suCo?.medias?.length || 0} Ảnh đính kèm</span>
                        </div>
                    </div>
                {phieu.trangThai !== TrangThaiPhanCong.CHO_XAC_NHAN && (
                        <div className="xac-minh-card-status-wrapper">
                            <span className="status-label">Trạng thái:</span>
                            {nhanTrangThai(phieu.trangThai)}
                        </div>
                    )}
            {!dangTuChoi && (
                <>
                   

                    {phieu.trangThai === TrangThaiPhanCong.CHO_XAC_NHAN && (
                        <div className="xac-minh-card-actions">
                            <div className="xac-minh-actions-left">
                                <button className="xac-minh-btn btn-tiep-nhan" onClick={onChapNhan} disabled={dangCapNhat}>
                                    <div className="btn-icon">✓</div> Tiếp nhận
                                </button>
                                <button className="xac-minh-btn btn-tu-choi" onClick={onBatDauTuChoi} disabled={dangCapNhat}>
                                    Từ chối
                                </button>
                            </div>
                            <button className="xac-minh-btn-text btn-detail" onClick={() => onXemChiTiet(phieu.maPhieuPhanCong)}>
                                Xem chi tiết &rarr;
                            </button>
                        </div>
                    )}

                    {phieu.trangThai === TrangThaiPhanCong.DA_XAC_NHAN && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-phan-cong" onClick={onPhanCong}>
                                Phân công nhân sự
                            </button>
                            <button className="xac-minh-btn btn-detail" onClick={() => onXemChiTiet(phieu.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}

                    {phieu.trangThai === TrangThaiPhanCong.DANG_XU_LY && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-phan-cong" style={{ backgroundColor: '#059669' }} onClick={onXemKetQua}>
                                Xem và Duyệt Kết Quả
                            </button>
                            <button className="xac-minh-btn btn-detail" onClick={() => onXemChiTiet(phieu.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}

                    {phieu.trangThai === TrangThaiPhanCong.CHO_DUYET_KET_QUA && (
                        <div className="xac-minh-card-actions">
                            <button
                                className="xac-minh-btn btn-phan-cong"
                                style={{ backgroundColor: '#f59e0b' }}
                                onClick={() => navigate(`/truongdonvi/duyet-ket-qua/${phieu.maPhieuPhanCong}`)}
                            >
                                Xem chi tiết để duyệt
                            </button>
                            <button className="xac-minh-btn btn-detail" onClick={() => onXemChiTiet(phieu.maPhieuPhanCong)}>
                                Xem phân công
                            </button>
                        </div>
                    )}

                    {phieu.trangThai === TrangThaiPhanCong.HOAN_THANH && (
                        <div className="xac-minh-card-actions">
                            <button className="xac-minh-btn btn-detail" onClick={() => onXemChiTiet(phieu.maPhieuPhanCong)}>
                                Xem chi tiết
                            </button>
                        </div>
                    )}

                  
                </>
            )}

            {dangTuChoi && (
                <div className="xac-minh-reject-form">
                    <label>LÝ DO TỪ CHỐI TIẾP NHẬN</label>
                    <textarea
                        placeholder="Ví dụ: Phản ánh không đúng chuyên môn của đơn vị..."
                        value={lyDoTuChoi}
                        onChange={(e) => setLyDoTuChoi(e.target.value)}
                        disabled={dangCapNhat}
                    />
                    <div className="xac-minh-reject-actions">
                        <button className="xac-minh-btn-huy" onClick={onHuyTuChoi} disabled={dangCapNhat}>
                            HỦY BỎ
                        </button>
                        <button className="xac-minh-btn-xac-nhan" onClick={onXacNhanTuChoi} disabled={dangCapNhat}>
                            XÁC NHẬN TỪ CHỐI
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};