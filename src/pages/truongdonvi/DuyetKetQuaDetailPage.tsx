import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, User, Check, X, FileText, Image as ImageIcon, Video, Calendar, Eye } from "lucide-react";

import "./DuyetKetQuaDetailPage.scss";
import { usePhieuPhanCongDetail } from "../../hooks/phancong/usePhieuPhanCongDetail";
import { GetChiTietPhanCongByPhanCongIdService } from "../../services/ChiTietPhanCongService";
import { GetKetQuaXuLyByChiTietPhanCongIdService, DuyetKetQuaXuLyService } from "../../services/KetQuaXuLyService";
import { API_CONFIG } from "../../constants/app.constants";
import type { ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import { TrangThaiKetQua, type KetQuaXuLySummaryResponse } from "../../types/KetQuaXuLy";
import DetailSuCo from "../../components/Suco/DetailSuCo";

interface ChiTietWithKetQua extends ChiTietPhanCongResponse {
    ketQuaList: KetQuaXuLySummaryResponse[];
}

const DuyetKetQuaDetailPage = () => {
    const { id: maPhieuPhanCong } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Data Hooks
    const { detail: phanCong, loading: loadingPhanCong } = usePhieuPhanCongDetail(maPhieuPhanCong);

    // Local State
    const [danhSach, setDanhSach] = useState<ChiTietWithKetQua[]>([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [lyDoTuChoi, setLyDoTuChoi] = useState("");

    const fetchResultsData = async () => {
        if (!maPhieuPhanCong) return;
        setLoadingResults(true);
        try {
            const chiTietRes = await GetChiTietPhanCongByPhanCongIdService(maPhieuPhanCong);
            if (chiTietRes.status === 200 && chiTietRes.data) {
                const chiTietList = chiTietRes.data;

                const fullData = await Promise.all(chiTietList.map(async (ct) => {
                    try {
                        const kqRes = await GetKetQuaXuLyByChiTietPhanCongIdService(ct.maChiTietPhanCong);
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
            setLoadingResults(false);
        }
    };

    useEffect(() => {
        fetchResultsData();
    }, [maPhieuPhanCong]);

    const handleDuyet = async (maKetQua: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn duyệt kết quả này? Sự cố sẽ được đánh dấu là Hoàn thành.")) return;
        setActionLoading(true);
        try {
            await DuyetKetQuaXuLyService(maKetQua, true);
            alert("Duyệt kết quả thành công!");
            fetchResultsData();
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
            alert("Đã từ chối kết quả và yêu cầu nhân viên làm lại!");
            setRejectingId(null);
            setLyDoTuChoi("");
            fetchResultsData();
        } catch (error) {
            alert("Lỗi khi từ chối kết quả");
        } finally {
            setActionLoading(false);
        }
    };

    if (loadingPhanCong) return <div className="dkq-loading-page">Đang tải thông tin...</div>;
    if (!phanCong) return <div className="dkq-error-page">Không tìm thấy thông tin phân công.</div>;

    const suco = phanCong.suCoDetail;

    return (
        <div className="dkq-page">
            <header className="dkq-header">
                <div className="dkq-header-top">
                    <button className="dkq-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Quay lại danh sách
                    </button>
                    <div className="dkq-tags">
                        <span className="dkq-status-tag">TRÌNH TRẠNG: {phanCong.trangThai}</span>
                        <span className="dkq-id-tag">ID PHIẾU: #{phanCong.maPhieuPhanCong}</span>
                    </div>
                </div>

                <div className="dkq-header-main">
                    <h1>Chi Tiết Phản Ánh & Duyệt Kết Quả</h1>
                </div>
            </header>

            <div className="dkq-content">
                {/* CỘT TRÁI: Chi tiết sự cố */}
                <div className="dkq-left-col">
                    {suco?.maSuCo ? (
                        <DetailSuCo maSuCo={suco.maSuCo} />
                    ) : (
                        <div className="dkq-card">
                            <p className="dkq-empty-msg">Không tìm thấy thông tin sự cố chi tiết.</p>
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI: Nhân sự & Kết quả xử lý */}
                <div className="dkq-right-col">
                    {/* Thông tin nhân sự phụ trách */}
                    {danhSach.length > 0 && danhSach[0].nhanVienXuLy && (
                        <div className="dkq-card dkq-staff-card">
                            <div className="dkq-card-header">
                                <span className="dkq-section-label">NHÂN SỰ PHỤ TRÁCH XỬ LÝ</span>
                            </div>
                            <div className="dkq-staff-info-box">
                                <div className="dkq-staff-avatar">
                                    {danhSach[0].nhanVienXuLy.anhDaiDien ? (
                                        <img src={danhSach[0].nhanVienXuLy.anhDaiDien} alt="avatar" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div className="dkq-staff-details">
                                    <span className="staff-role">NHÂN VIÊN ĐƠN VỊ</span>
                                    <h4 className="staff-name">{danhSach[0].nhanVienXuLy.hoTen}</h4>
                                    <span className="staff-team">Mã nhân viên: {danhSach[0].nhanVienXuLy.maNhanVien}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danh sách kết quả xử lý (cũ và mới) */}
                    <div className="dkq-card dkq-results-card">
                        <div className="dkq-card-header">
                            <span className="dkq-section-label">KẾT QUẢ XỬ LÝ SỰ CỐ</span>
                        </div>

                        {loadingResults ? (
                            <div className="dkq-loading-text">Đang tải kết quả xử lý...</div>
                        ) : danhSach.length === 0 ? (
                            <div className="dkq-empty-msg">Chưa có thông tin phân công.</div>
                        ) : (
                            <div className="dkq-results-list">
                                {danhSach.map((ct) => (
                                    <div key={ct.maChiTietPhanCong} className="dkq-assignment-block">
                                        {ct.ketQuaList.length === 0 ? (
                                            <p className="dkq-no-result">Nhân viên chưa nộp kết quả xử lý.</p>
                                        ) : (
                                            // Sắp xếp kết quả: kết quả chờ duyệt hiển thị trước, các kết quả cũ hơn hiển thị dưới
                                            [...ct.ketQuaList]
                                                .sort((a, b) => {
                                                    if (a.trangThai === TrangThaiKetQua.CHO_DUYET && b.trangThai !== TrangThaiKetQua.CHO_DUYET) return -1;
                                                    if (a.trangThai !== TrangThaiKetQua.CHO_DUYET && b.trangThai === TrangThaiKetQua.CHO_DUYET) return 1;
                                                    return new Date(b.thoiGianNop).getTime() - new Date(a.thoiGianNop).getTime();
                                                })
                                                .map((kq) => (
                                                    <div 
                                                        key={kq.maKetQuaXuLy} 
                                                        className={`dkq-result-item ${kq.trangThai === TrangThaiKetQua.CHO_DUYET ? 'cho-duyet' : ''}`}
                                                    >
                                                        <div className="dkq-result-header">
                                                            <span className={`trang-thai-kq badge-${kq.trangThai?.toLowerCase()}`}>
                                                                {kq.trangThai === TrangThaiKetQua.CHO_DUYET ? "Chờ duyệt" : 
                                                                 kq.trangThai === TrangThaiKetQua.DA_DUYET ? "Đã duyệt" : 
                                                                 kq.trangThai === TrangThaiKetQua.TU_CHOI ? "Đã từ chối (Làm lại)" : 
                                                                 kq.trangThai === TrangThaiKetQua.CONG_KHAI ? "Công khai" : 
                                                                 kq.trangThai === TrangThaiKetQua.HOAN_THANH ? "Hoàn thành" : kq.trangThai}
                                                            </span>
                                                            <span className="thoi-gian-nop">
                                                                {kq.thoiGianNop 
                                                                    ? formatDistanceToNow(new Date(kq.thoiGianNop), { addSuffix: true, locale: vi }) 
                                                                    : ""}
                                                            </span>
                                                        </div>

                                                        <div className="noi-dung-kq">
                                                            <p className="kq-text-title"><FileText size={14} style={{ marginRight: '6px' }} /> Nội dung thực hiện:</p>
                                                            <p className="kq-text-content">{kq.noiDungThucHien}</p>
                                                        </div>

                                                        {kq.medias && kq.medias.length > 0 && (
                                                            <div className="dkq-medias-box">
                                                                <p className="kq-text-title"><ImageIcon size={14} style={{ marginRight: '6px' }} /> Minh chứng đính kèm:</p>
                                                                <div className="dkq-media-grid">
                                                                    {kq.medias.map((m, idx) => (
                                                                        <a 
                                                                            key={idx} 
                                                                            href={`${API_CONFIG.BASE_URL}${m.url}`} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer" 
                                                                            className="dkq-media-item-link"
                                                                        >
                                                                            {m.url.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i) ? (
                                                                                <div className="dkq-media-preview-container video-preview">
                                                                                    <video src={`${API_CONFIG.BASE_URL}${m.url}`} />
                                                                                    <div className="video-overlay"><Video size={20} /></div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="dkq-media-preview-container image-preview">
                                                                                    <img src={`${API_CONFIG.BASE_URL}${m.url}`} alt={`Minh chứng ${idx + 1}`} />
                                                                                    <div className="image-overlay"><Eye size={16} /></div>
                                                                                </div>
                                                                            )}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {kq.lyDoTuChoi && (
                                                            <div className="dkq-rejection-box">
                                                                <strong>Lý do từ chối:</strong> {kq.lyDoTuChoi}
                                                            </div>
                                                        )}

                                                        {kq.trangThai === TrangThaiKetQua.CHO_DUYET && (
                                                            <div className="dkq-actions-area">
                                                                {rejectingId === kq.maKetQuaXuLy ? (
                                                                    <div className="dkq-rejection-form">
                                                                        <textarea 
                                                                            placeholder="Nhập lý do chi tiết yêu cầu làm lại kết quả..."
                                                                            value={lyDoTuChoi}
                                                                            onChange={(e) => setLyDoTuChoi(e.target.value)}
                                                                            disabled={actionLoading}
                                                                        />
                                                                        <div className="rejection-buttons">
                                                                            <button 
                                                                                className="btn-cancel" 
                                                                                onClick={() => {
                                                                                    setRejectingId(null);
                                                                                    setLyDoTuChoi("");
                                                                                }} 
                                                                                disabled={actionLoading}
                                                                            >
                                                                                Hủy
                                                                            </button>
                                                                            <button 
                                                                                className="btn-confirm-reject" 
                                                                                onClick={() => handleTuChoi(kq.maKetQuaXuLy)} 
                                                                                disabled={actionLoading}
                                                                            >
                                                                                Xác nhận yêu cầu làm lại
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="dkq-normal-actions">
                                                                        <button 
                                                                            className="btn-approve" 
                                                                            onClick={() => handleDuyet(kq.maKetQuaXuLy)} 
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <Check size={16} /> Duyệt kết quả
                                                                        </button>
                                                                        <button 
                                                                            className="btn-reject" 
                                                                            onClick={() => setRejectingId(kq.maKetQuaXuLy)} 
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <X size={16} /> Yêu cầu làm lại
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuyetKetQuaDetailPage;
