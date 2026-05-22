import { useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MapPin, FileText, PlayCircle, CheckCircle, Image, X, BookOpen } from "lucide-react";
import "./XuLySuCoPage.scss";
import { useChiTietPhanCongNhanVien } from "../../hooks/chitietphancong/useChiTietPhanCongNhanVien";
import { useUpdateChiTietPhanCong } from "../../hooks/chitietphancong/useUpdateChiTietPhanCong";
import { useTaoKetQua } from "../../hooks/ketquaxuly/useTaoKetQua";
import { usePhieuChiDaoByChiTiet } from "../../hooks/phieuchidao/usePhieuChiDaoByChiTiet";
import { TrangThaiChiTietPhanCong, type ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import apiClient from "../../services/apiClient";
import { API_CONFIG } from "../../constants/app.constants";

const XuLySuCoPage = () => {
    const { data, loading, error, refetch } = useChiTietPhanCongNhanVien(0, 20);
    const { updateTrangThai, loading: updating } = useUpdateChiTietPhanCong();
    const { taoKetQua, loading: nopLoading } = useTaoKetQua();
    const { chiDaoData, chiDaoLoading, fetchChiDao } = usePhieuChiDaoByChiTiet();

    const [tabHienTai, setTabHienTai] = useState<"DANG_CHO" | "DANG_XU_LY" | "CHO_DUYET" | "TU_CHOI" | "HOAN_THANH">("DANG_CHO");
    const [phieuChiDaoHienThi, setPhieuChiDaoHienThi] = useState<string | null>(null);
    const [phieuNopKetQua, setPhieuNopKetQua] = useState<ChiTietPhanCongResponse | null>(null);
    const [noiDungKetQua, setNoiDungKetQua] = useState("");
    const [anhKetQua, setAnhKetQua] = useState<string[]>([]);
    const [dangTaiAnh, setDangTaiAnh] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tatCaPhieu = data?.content || [];

    const phieuDangCho = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.DANG_CHO);
    const phieuDangLam = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY);
    const phieuChoDuyet = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.CHO_DUYET);
    const phieuTuChoi = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.TU_CHOI);
    const phieuHoanThanh = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH);

    const phieuHienThi = tabHienTai === "DANG_CHO" ? phieuDangCho
        : tabHienTai === "DANG_XU_LY" ? phieuDangLam
            : tabHienTai === "CHO_DUYET" ? phieuChoDuyet
                : tabHienTai === "TU_CHOI" ? phieuTuChoi
                    : phieuHoanThanh;

    const batDauXuLy = async (ma: string) => {
        if (!window.confirm("Bắt đầu xử lý sự cố này?")) return;
        await updateTrangThai(ma, TrangThaiChiTietPhanCong.DANG_XU_LY);
        refetch();
    };

    const moModalChiDao = (ma: string) => {
        setPhieuChiDaoHienThi(ma);
        fetchChiDao(ma);
    };

    const moModalKetQua = (phieu: ChiTietPhanCongResponse) => {
        setPhieuNopKetQua(phieu);
        setNoiDungKetQua("");
        setAnhKetQua([]);
    };

    const chonAnh = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setDangTaiAnh(true);
        try {
            const urlsMoi: string[] = [];
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("files", file);
                formData.append("type", "ketqua");
                const res = await apiClient.post(API_CONFIG.ENDPOINTS.FILE.UPLOAD, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const urlData = res.data?.data || res.data?.url;
                if (Array.isArray(urlData)) {
                    urlsMoi.push(...urlData);
                } else if (urlData && typeof urlData === 'string') {
                    urlsMoi.push(urlData);
                }
            }
            setAnhKetQua(prev => [...prev, ...urlsMoi]);
        } catch {
            alert("Tải ảnh thất bại, vui lòng thử lại.");
        } finally {
            setDangTaiAnh(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const xoaAnh = (idx: number) => {
        setAnhKetQua(prev => prev.filter((_, i) => i !== idx));
    };

    const nopKetQua = async () => {
        if (!phieuNopKetQua) return;
        if (!noiDungKetQua.trim()) {
            alert("Vui lòng nhập mô tả kết quả xử lý.");
            return;
        }
        const ketQua = await taoKetQua({
            maChiTietPhanCong: phieuNopKetQua.maChiTietPhanCong,
            noiDungThucHien: noiDungKetQua,
            mediaUrls: anhKetQua,
        });
        if (ketQua) {
            alert("Nộp kết quả thành công! Đang chờ trưởng đơn vị duyệt.");
            setPhieuNopKetQua(null);
            refetch();
        } else {
            alert("Nộp kết quả thất bại. Vui lòng thử lại.");
        }
    };

    const getBadge = (trangThai: TrangThaiChiTietPhanCong) => {
        if (trangThai === TrangThaiChiTietPhanCong.DANG_CHO) return <span className="trang-thai-badge cho">Chờ xử lý</span>;
        if (trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY) return <span className="trang-thai-badge dang">Đang xử lý</span>;
        if (trangThai === TrangThaiChiTietPhanCong.CHO_DUYET) return <span className="trang-thai-badge" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>Chờ duyệt</span>;
        if (trangThai === TrangThaiChiTietPhanCong.TU_CHOI) return <span className="trang-thai-badge" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>Từ chối</span>;
        return <span className="trang-thai-badge xong">Hoàn thành</span>;
    };

    if (loading && !data) return <div className="trang-xu-ly-loading">Đang tải dữ liệu...</div>;
    if (error) return <div className="trang-xu-ly-loading" style={{ color: "#ef4444" }}>{error}</div>;

    return (
        <div className="trang-xu-ly">
            <header className="trang-xu-ly-header">
                <h1>Danh sách công việc</h1>
                <p>Quản lý và thực hiện các sự cố được phân công đến bạn.</p>
            </header>

            {/* Tabs */}
            <div className="trang-xu-ly-tabs">
                {[
                    { key: "DANG_CHO", label: "Chờ xử lý", count: phieuDangCho.length },
                    { key: "DANG_XU_LY", label: "Đang xử lý", count: phieuDangLam.length },
                    { key: "CHO_DUYET", label: "Chờ duyệt", count: phieuChoDuyet.length },
                    { key: "TU_CHOI", label: "Từ chối", count: phieuTuChoi.length },
                    { key: "HOAN_THANH", label: "Hoàn thành", count: phieuHoanThanh.length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`trang-xu-ly-tab ${tabHienTai === tab.key ? "active" : ""}`}
                        onClick={() => setTabHienTai(tab.key as any)}
                    >
                        {tab.label}
                        {tab.count > 0 && <span className="trang-xu-ly-badge">{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* Danh sách card */}
            <div className="trang-xu-ly-grid">
                {phieuHienThi.length === 0 ? (
                    <div className="trang-xu-ly-empty">Không có công việc nào trong mục này.</div>
                ) : phieuHienThi.map(phieu => {
                    const suCo = (phieu.phieuPhanCong as any)?.suCoDetail;
                    const thoiGian = phieu.thoiGianTao
                        ? formatDistanceToNow(new Date(phieu.thoiGianTao), { addSuffix: true, locale: vi })
                        : "";
                    return (
                        <div key={phieu.maChiTietPhanCong} className="trang-xu-ly-card">
                            <div className="trang-xu-ly-card-header">
                                <div className="trang-xu-ly-card-tags">
                                    <span className="trang-xu-ly-card-tag">PHÂN CÔNG</span>
                                    <span className="trang-xu-ly-card-id">#{phieu.maChiTietPhanCong}</span>
                                </div>
                                <span className="trang-xu-ly-card-time">{thoiGian}</span>
                            </div>

                            <h3 className="trang-xu-ly-card-title">
                                {(suCo as any)?.noiDung || phieu.phieuPhanCong?.maSuCo || "Sự cố chưa có tiêu đề"}
                            </h3>

                            <div className="trang-xu-ly-card-meta">
                                <div className="trang-xu-ly-card-meta-row">
                                    <MapPin size={13} />
                                    <span>{(suCo as any)?.diaDiem || "Chưa có địa điểm"}</span>
                                </div>
                                <div className="trang-xu-ly-card-meta-row">
                                    <FileText size={13} />
                                    <span>Trạng thái: {getBadge(phieu.trangThai)}</span>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="nut-hanh-dong">
                                <button
                                    className="nut-xem-chi-dao"
                                    onClick={() => moModalChiDao(phieu.maChiTietPhanCong)}
                                >
                                    <BookOpen size={13} /> Xem chỉ đạo
                                </button>

                                {phieu.trangThai === TrangThaiChiTietPhanCong.DANG_CHO && (
                                    <button
                                        className="nut-bat-dau"
                                        onClick={() => batDauXuLy(phieu.maChiTietPhanCong)}
                                        disabled={updating}
                                    >
                                        <PlayCircle size={13} /> Bắt đầu xử lý
                                    </button>
                                )}

                                {(phieu.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY || phieu.trangThai === TrangThaiChiTietPhanCong.TU_CHOI) && (
                                    <button
                                        className="nut-nop-ket-qua"
                                        onClick={() => moModalKetQua(phieu)}
                                    >
                                        <CheckCircle size={13} /> Nộp kết quả
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal xem chỉ đạo */}
            {phieuChiDaoHienThi && (
                <div className="modal-chi-dao-nen" onClick={() => setPhieuChiDaoHienThi(null)}>
                    <div className="modal-chi-dao-hop" onClick={e => e.stopPropagation()}>
                        <h2>📋 Nội dung chỉ đạo</h2>
                        {chiDaoLoading ? (
                            <p style={{ color: "#9ca3af", textAlign: "center" }}>Đang tải...</p>
                        ) : chiDaoData.length === 0 ? (
                            <div className="khong-co-chi-dao">Chưa có chỉ đạo nào cho công việc này.</div>
                        ) : (
                            chiDaoData.map((cd: any, idx: number) => (
                                <div key={idx} className="chi-dao-item">
                                    <div className="chi-dao-item-noi-dung">{cd.noiDung}</div>
                                    <div className="chi-dao-item-ngay">📅 {cd.ngayChiDao || cd.thoiGianTao || ""}</div>
                                </div>
                            ))
                        )}
                        <button className="nut-dong-modal" onClick={() => setPhieuChiDaoHienThi(null)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Modal nộp kết quả */}
            {phieuNopKetQua && (
                <div className="modal-ket-qua-nen" onClick={() => setPhieuNopKetQua(null)}>
                    <div className="modal-ket-qua-hop" onClick={e => e.stopPropagation()}>
                        <h2>✅ Nộp kết quả xử lý</h2>
                        <div className="ten-su-co">
                            Công việc: #{phieuNopKetQua.maChiTietPhanCong}
                        </div>

                        <label>Mô tả kết quả thực hiện *</label>
                        <textarea
                            placeholder="Mô tả chi tiết những gì đã thực hiện, kết quả đạt được..."
                            value={noiDungKetQua}
                            onChange={e => setNoiDungKetQua(e.target.value)}
                            disabled={nopLoading}
                        />

                        <div className="khu-vuc-anh">
                            <label>Hình ảnh/Video minh chứng</label>
                            <div className="danh-sach-anh">
                                {anhKetQua.map((url, idx) => (
                                    <div key={idx} className="khung-anh">
                                        {url.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i) ? (
                                            <video src={`${API_CONFIG.BASE_URL}${url}`} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <img src={`${API_CONFIG.BASE_URL}${url}`} alt={`Ảnh ${idx + 1}`} />
                                        )}
                                        <button className="nut-xoa-anh" onClick={() => xoaAnh(idx)}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <button className="them-anh-btn" onClick={() => fileInputRef.current?.click()} disabled={dangTaiAnh}>
                                <Image size={14} />
                                {dangTaiAnh ? "Đang tải tệp..." : "Thêm ảnh/video"}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                style={{ display: "none" }}
                                onChange={chonAnh}
                            />
                        </div>

                        <div className="nhom-nut-modal">
                            <button className="nut-huy-modal" onClick={() => setPhieuNopKetQua(null)} disabled={nopLoading}>
                                Hủy
                            </button>
                            <button className="nut-nop-modal" onClick={nopKetQua} disabled={nopLoading || dangTaiAnh}>
                                {nopLoading ? "Đang nộp..." : "Nộp kết quả"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default XuLySuCoPage;
