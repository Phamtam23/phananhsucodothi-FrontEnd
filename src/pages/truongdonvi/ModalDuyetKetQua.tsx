import { useState, useEffect } from "react";
import { GetChiTietPhanCongByPhanCongIdService } from "../../services/ChiTietPhanCongService";
import { GetKetQuaXuLyByChiTietPhanCongIdService, DuyetKetQuaXuLyService } from "../../services/KetQuaXuLyService";
import { API_CONFIG } from "../../constants/app.constants";
import type { ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import { TrangThaiKetQua, type KetQuaXuLySummaryResponse } from "../../types/KetQuaXuLy";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import "./ModalDuyetKetQua.scss";

interface ModalDuyetKetQuaProps {
    maPhieuPhanCong: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface ChiTietWithKetQua extends ChiTietPhanCongResponse {
    ketQuaList: KetQuaXuLySummaryResponse[];
}

export const ModalDuyetKetQua = ({ maPhieuPhanCong, onClose, onSuccess }: ModalDuyetKetQuaProps) => {
    const [danhSach, setDanhSach] = useState<ChiTietWithKetQua[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [lyDoTuChoi, setLyDoTuChoi] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch ChiTietPhanCong
                console.log("Lấy chi tiết phân công cho mã:", maPhieuPhanCong);
                const chiTietRes = await GetChiTietPhanCongByPhanCongIdService(maPhieuPhanCong);
                if (chiTietRes.status === 200 && chiTietRes.data) {
                    const chiTietList = chiTietRes.data;
                    
                    // 2. Fetch KetQuaXuLy for each ChiTiet
                    const fullData = await Promise.all(chiTietList.map(async (ct) => {
                        try {
                            const kqRes = await GetKetQuaXuLyByChiTietPhanCongIdService(ct.maChiTietPhanCong);
                            console.log(`Kết quả xử lý cho ChiTietPhanCong ${ct.maChiTietPhanCong}:`, kqRes);
                            return {
                                ...ct,
                                ketQuaList: kqRes.data || []
                            };
                        } catch (e) {
                            return { ...ct, ketQuaList: [] };
                        }
                    }));
                    
                    setDanhSach(fullData);
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu kết quả", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [maPhieuPhanCong]);

    const handleDuyet = async (maKetQua: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn duyệt kết quả này? Sự cố sẽ được đánh dấu là Hoàn thành.")) return;
        setActionLoading(true);
        try {
            await DuyetKetQuaXuLyService(maKetQua, true);
            alert("Duyệt kết quả thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            alert("Lỗi khi duyệt kết quả");
        } finally {
            setActionLoading(false);
        }
    };

    const handleTuChoi = async (maKetQua: string) => {
        if (!lyDoTuChoi.trim()) {
            alert("Vui lòng nhập lý do từ chối để nhân viên làm lại.");
            return;
        }
        setActionLoading(true);
        try {
            await DuyetKetQuaXuLyService(maKetQua, false, lyDoTuChoi);
            alert("Đã từ chối kết quả!");
            setRejectingId(null);
            setLyDoTuChoi("");
            onSuccess();
            onClose();
        } catch (error) {
            alert("Lỗi khi từ chối kết quả");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="khung-nen-modal-duyet">
            <div className="khung-modal-duyet">
                <div className="tieu-de-modal">
                    <h2>Xét Duyệt Kết Quả Xử Lý</h2>
                    <button className="nut-dong" onClick={onClose}>✕</button>
                </div>
                
                <div className="noi-dung-modal">
                    {loading ? (
                        <div className="dang-tai">Đang tải dữ liệu...</div>
                    ) : danhSach.length === 0 ? (
                        <div className="trong">Chưa có thông tin phân công nào.</div>
                    ) : (
                        <div className="danh-sach-chi-tiet">
                            {danhSach.map((ct) => (
                                <div key={ct.maChiTietPhanCong} className="the-chi-tiet">
                                    <div className="thong-tin-nhan-vien">
                                        <div className="avatar-nhan-vien">👤</div>
                                        <div>
                                            <strong>{ct.nhanVienXuLy?.hoTen || "Nhân viên"}</strong>
                                            <div className="thoi-gian-phan-cong">
                                                Phân công: {ct.thoiGianTao ? formatDistanceToNow(new Date(ct.thoiGianTao), { addSuffix: true, locale: vi }) : ""}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="danh-sach-ket-qua">
                                        {ct.ketQuaList.length === 0 ? (
                                            <div className="chua-co-ket-qua">Nhân viên chưa nộp kết quả xử lý.</div>
                                        ) : (
                                            ct.ketQuaList.map((kq) => (
                                                <div key={kq.maKetQuaXuLy} className={`the-ket-qua ${kq.trangThai === TrangThaiKetQua.CHO_DUYET ? 'cho-duyet' : ''}`}>
                                                    <div className="ket-qua-header">
                                                         <span className={`trang-thai-kq badge-${kq.trangThai?.toLowerCase()}`}>
                                                             {kq.trangThai === TrangThaiKetQua.CHO_DUYET ? "Chờ duyệt" : 
                                                              kq.trangThai === TrangThaiKetQua.DA_DUYET ? "Đã duyệt" : 
                                                              kq.trangThai === TrangThaiKetQua.TU_CHOI ? "Đã từ chối" : 
                                                              kq.trangThai === TrangThaiKetQua.CONG_KHAI ? "Công khai" : 
                                                              kq.trangThai === TrangThaiKetQua.HOAN_THANH ? "Hoàn thành" : kq.trangThai}
                                                         </span>
                                                         <span className="thoi-gian-nop">
                                                             Nộp: {kq.thoiGianNop ? formatDistanceToNow(new Date(kq.thoiGianNop), { addSuffix: true, locale: vi }) : ""}
                                                         </span>
                                                     </div>
                                                     
                                                     <div className="noi-dung-kq">
                                                         {kq.noiDungThucHien}
                                                     </div>

                                                     {kq.medias && kq.medias.length > 0 && (
                                                         <div className="danh-sach-anh-kq" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px", marginBottom: "12px" }}>
                                                             {kq.medias.map((m, idx) => (
                                                                 <div key={idx} className="khung-anh-kq" style={{ width: "80px", height: "80px", border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                                                                     {m.url.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i) ? (
                                                                         <video src={`${API_CONFIG.BASE_URL}${m.url}`} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                     ) : (
                                                                         <img src={`${API_CONFIG.BASE_URL}${m.url}`} alt={`Ảnh ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                     )}
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     )}

                                                    {kq.lyDoTuChoi && (
                                                        <div className="ly-do-tu-choi-box">
                                                            <strong>Lý do từ chối:</strong> {kq.lyDoTuChoi}
                                                        </div>
                                                    )}
                                                    
                                                    {kq.trangThai === TrangThaiKetQua.CHO_DUYET && (
                                                        <div className="hanh-dong-kq">
                                                            {rejectingId === kq.maKetQuaXuLy ? (
                                                                <div className="khung-tu-choi">
                                                                    <textarea 
                                                                        placeholder="Nhập lý do từ chối yêu cầu làm lại..."
                                                                        value={lyDoTuChoi}
                                                                        onChange={(e) => setLyDoTuChoi(e.target.value)}
                                                                        disabled={actionLoading}
                                                                    />
                                                                    <div className="nut-tu-choi-actions">
                                                                        <button className="nut-huy" onClick={() => setRejectingId(null)} disabled={actionLoading}>Hủy</button>
                                                                        <button className="nut-xac-nhan-tu-choi" onClick={() => handleTuChoi(kq.maKetQuaXuLy)} disabled={actionLoading}>Xác nhận từ chối</button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button className="nut-duyet" onClick={() => handleDuyet(kq.maKetQuaXuLy)} disabled={actionLoading}>✓ Duyệt kết quả</button>
                                                                    <button className="nut-tu-choi" onClick={() => setRejectingId(kq.maKetQuaXuLy)} disabled={actionLoading}>✕ Từ chối</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
