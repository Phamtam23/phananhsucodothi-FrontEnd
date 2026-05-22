import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MapPin, Clock, FileText, AlertCircle } from "lucide-react";
import "./LichSuThucHienPage.scss";
import { useChiTietPhanCongNhanVien } from "../../hooks/chitietphancong/useChiTietPhanCongNhanVien";
import { TrangThaiChiTietPhanCong } from "../../types/ChiTietPhanCong";
import apiClient from "../../services/apiClient";
import { API_CONFIG } from "../../constants/app.constants";

const getBadge = (trangThai: TrangThaiChiTietPhanCong) => {
    switch (trangThai) {
        case TrangThaiChiTietPhanCong.HOAN_THANH:
            return <span className="badge-lich-su xong">Đã hoàn thành</span>;
        case TrangThaiChiTietPhanCong.DANG_XU_LY:
            return <span className="badge-lich-su dang">Đang xử lý</span>;
        case TrangThaiChiTietPhanCong.DANG_CHO:
            return <span className="badge-lich-su cho">Chờ xử lý</span>;
        default:
            return <span className="badge-lich-su cho">{trangThai}</span>;
    }
};

const KetQuaCuaPhieu = ({ maChiTiet }: { maChiTiet: string }) => {
    const [ketQua, setKetQua] = useState<any>(null);

    useEffect(() => {
        apiClient.get(API_CONFIG.ENDPOINTS.KETQUAXULY.GET_BY_CHITIETPHANCONG_ID(maChiTiet))
            .then(res => {
                const d = res.data?.data;
                if (Array.isArray(d) && d.length > 0) setKetQua(d[0]);
                else if (d && !Array.isArray(d)) setKetQua(d);
            })
            .catch(() => { });
    }, [maChiTiet]);

    if (!ketQua) return null;

    return (
        <div className="ket-qua-da-nop">
            <div className="ket-qua-da-nop-label">
                📋 Kết quả đã nộp — {ketQua.trangThai === "CHO_DUYET" ? "⏳ Chờ duyệt" : ketQua.trangThai === "DA_DUYET" ? "✅ Đã duyệt" : "❌ Bị từ chối"}
            </div>
            <div className="ket-qua-da-nop-noi-dung">{ketQua.noiDungThucHien}</div>
            {ketQua.lyDoTuChoi && (
                <div className="ket-qua-da-nop-ly-do-tu-choi">
                    ⚠️ Lý do từ chối: {ketQua.lyDoTuChoi}
                </div>
            )}
        </div>
    );
};

const LichSuThucHienPage = () => {
    const { data, loading, error } = useChiTietPhanCongNhanVien(0, 50);

    const tatCaPhieu = data?.content || [];
    // Lịch sử là toàn bộ: đã xong và đang làm
    const lichSu = tatCaPhieu.filter(p =>
        p.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH ||
        p.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY
    );

    if (loading) return <div className="trang-lich-su-loading">Đang tải lịch sử...</div>;
    if (error) return <div className="trang-lich-su-loading" style={{ color: "#ef4444" }}>{error}</div>;

    return (
        <div className="trang-lich-su">
            <header className="trang-lich-su-header">
                <h1>Lịch sử thực hiện</h1>
                <p>Xem lại tất cả các công việc đã và đang xử lý của bạn.</p>
            </header>

            {lichSu.length === 0 ? (
                <div className="trang-lich-su-empty-state">
                    <div className="bieu-tuong-trong">📋</div>
                    <p>Chưa có lịch sử thực hiện nào.</p>
                </div>
            ) : (
                <div className="trang-lich-su-danh-sach">
                    {lichSu.map(phieu => {
                        const suCo = (phieu.phieuPhanCong as any)?.suCoDetail;
                        const laBiTuChoi = phieu.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH;
                        const thoiGian = phieu.thoiGianTao
                            ? formatDistanceToNow(new Date(phieu.thoiGianTao), { addSuffix: true, locale: vi })
                            : "";

                        return (
                            <div
                                key={phieu.maChiTietPhanCong}
                                className={`trang-lich-su-item ${phieu.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH ? "trang-thai-xong"
                                    : "trang-thai-cho"
                                    }`}
                            >
                                <div className="trang-lich-su-item-header">
                                    <div>
                                        <div className="trang-lich-su-item-title">
                                            {suCo?.noiDung || phieu.phieuPhanCong?.maSuCo || "Sự cố #" + phieu.maChiTietPhanCong}
                                        </div>
                                        <span className="trang-lich-su-item-id">Mã phân công: {phieu.maChiTietPhanCong}</span>
                                    </div>
                                    {getBadge(phieu.trangThai)}
                                </div>

                                <div className="trang-lich-su-item-meta">
                                    {suCo?.diaDiem && (
                                        <div className="trang-lich-su-item-meta-row">
                                            <MapPin size={12} />
                                            <span>{suCo.diaDiem}</span>
                                        </div>
                                    )}
                                    <div className="trang-lich-su-item-meta-row">
                                        <Clock size={12} />
                                        <span>{thoiGian}</span>
                                    </div>
                                </div>

                                <KetQuaCuaPhieu maChiTiet={phieu.maChiTietPhanCong} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LichSuThucHienPage;
