import { useState, useRef } from "react";
import { Image, Send } from "lucide-react";
import "./DangKetQuaPage.scss";
import { useChiTietPhanCongNhanVien } from "../../hooks/chitietphancong/useChiTietPhanCongNhanVien";
import { useTaoKetQua } from "../../hooks/ketquaxuly/useTaoKetQua";
import { TrangThaiChiTietPhanCong } from "../../types/ChiTietPhanCong";
import apiClient from "../../services/apiClient";
import { API_CONFIG } from "../../constants/app.constants";
import {useNavigate}  from "react-router-dom";
const DangKetQuaPage = () => {
    const { data, loading } = useChiTietPhanCongNhanVien(0, 50);
    const { taoKetQua, loading: nopLoading } = useTaoKetQua();
      const navigate = useNavigate();

    const [phieuChon, setPhieuChon] = useState("");
    const [noiDung, setNoiDung] = useState("");
    const [anhMinhChung, setAnhMinhChung] = useState<string[]>([]);
    const [dangTaiAnh, setDangTaiAnh] = useState(false);
    const [thanhCong, setThanhCong] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Chỉ hiển thị các phân công đang xử lý (đã bắt đầu)
    const tatCaPhieu = data?.content || [];
    const phieuDangLam = tatCaPhieu.filter(
        p => p.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY
    );

    const phieuDangChon = phieuDangLam.find(p => p.maChiTietPhanCong === phieuChon);

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
                const res = await apiClient.post("/files/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                const urlData = res.data?.data || res.data?.url;
                if (Array.isArray(urlData)) {
                    urlsMoi.push(...urlData);
                } else if (urlData && typeof urlData === 'string') {
                    urlsMoi.push(urlData);
                }
            }
            setAnhMinhChung(prev => [...prev, ...urlsMoi]);
        } catch {
            alert("Tải ảnh thất bại. Vui lòng thử lại.");
        } finally {
            setDangTaiAnh(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const xoaAnh = (idx: number) => {
        setAnhMinhChung(prev => prev.filter((_, i) => i !== idx));
    };

    const nopKetQua = async () => {
        if (!phieuChon) {
            alert("Vui lòng chọn công việc cần nộp kết quả.");
            return;
        }
        if (!noiDung.trim()) {
            alert("Vui lòng nhập mô tả kết quả.");
            return;
        }

        const ketQua = await taoKetQua({
            maChiTietPhanCong: phieuChon,
            noiDungThucHien: noiDung,
            mediaUrls: anhMinhChung,
        });

        if (ketQua) {
            setThanhCong(true);
        } else {
            alert("Nộp kết quả thất bại. Vui lòng thử lại.");
        }
    };

    const datLai = () => {
        setPhieuChon("");
        setNoiDung("");
        setAnhMinhChung([]);
        setThanhCong(false);
    };

    const handOnclick = () =>{
        navigate("/xu-ly")
    }
    if (loading) {
        return <div className="trang-dang-ket-qua"><div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>Đang tải...</div></div>;
    }

    // Màn hình thành công
    if (thanhCong) {
        return (
            <div className="trang-dang-ket-qua">
                <header className="trang-dang-ket-qua-header">
                    <h1>Đăng kết quả xử lý</h1>
                    <p>Báo cáo kết quả công việc đã hoàn thành.</p>
                </header>
                <div className="trang-dang-ket-qua-thanh-cong">
                    <div className="bieu-tuong">✅</div>
                    <h2>Nộp kết quả thành công!</h2>
                    <p>Kết quả của bạn đã được ghi nhận và đang chờ trưởng đơn vị xem xét, duyệt.</p>
                    <button className="nut-lam-tiep" onClick={handOnclick}>
                       Okee
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="trang-dang-ket-qua">
            <header className="trang-dang-ket-qua-header">
                <h1>Đăng kết quả xử lý</h1>
                <p>Báo cáo kết quả công việc đã hoàn thành cho trưởng đơn vị kiểm duyệt.</p>
            </header>

            {/* Bước 1: Chọn công việc */}
            <div className="trang-dang-ket-qua-chon-phieu">
                <label>📌 Chọn công việc cần nộp kết quả</label>
                {phieuDangLam.length === 0 ? (
                    <p style={{ color: "#9ca3af", fontSize: "14px", margin: "8px 0 0" }}>
                        Hiện không có công việc nào đang ở trạng thái "Đang xử lý".
                        Hãy vào mục <strong>Xử lý sự cố</strong> để bắt đầu trước.
                    </p>
                ) : (
                    <select
                        value={phieuChon}
                        onChange={e => setPhieuChon(e.target.value)}
                    >
                        <option value="">-- Chọn công việc --</option>
                        {phieuDangLam.map(p => (
                            <option key={p.maChiTietPhanCong} value={p.maChiTietPhanCong}>
                                [{p.maChiTietPhanCong}] — {(p.phieuPhanCong as any)?.suCoDetail?.noiDung || p.phieuPhanCong?.maSuCo || "Sự cố không rõ"}
                            </option>
                        ))}
                    </select>
                )}

                {phieuDangChon && (
                    <div className="trang-dang-ket-qua-thong-tin-chon">
                        <strong>
                            {(phieuDangChon.phieuPhanCong as any)?.suCoDetail?.noiDung || "Không có tiêu đề"}
                        </strong>
                        📍 {(phieuDangChon.phieuPhanCong as any)?.suCoDetail?.diaDiem || "Chưa có địa điểm"}
                    </div>
                )}
            </div>

            {/* Bước 2: Điền kết quả (chỉ hiện khi đã chọn công việc) */}
            {phieuChon && (
                <div className="trang-dang-ket-qua-form">
                    <label>📝 Mô tả kết quả thực hiện *</label>
                    <textarea
                        placeholder="Mô tả chi tiết những gì bạn đã thực hiện, kết quả đạt được, tình trạng hiện tại sau xử lý..."
                        value={noiDung}
                        onChange={e => setNoiDung(e.target.value)}
                        disabled={nopLoading}
                    />

                    {/* Khu vực ảnh */}
                    <div className="trang-dang-ket-qua-khu-anh">
                        <label>🖼️ Hình ảnh minh chứng</label>

                        <div className="luoi-anh">
                            {anhMinhChung.map((url, idx) => (
                                <div key={idx} className="o-anh">
                                    {url.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i) ? (
                                        <video src={`${API_CONFIG.BASE_URL}${url}`} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <img src={`${API_CONFIG.BASE_URL}${url}`} alt={`Minh chứng ${idx + 1}`} />
                                    )}
                                    <button className="nut-xoa" onClick={() => xoaAnh(idx)}>✕</button>
                                </div>
                            ))}
                        </div>

                        <button
                            className="nut-them-anh"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={dangTaiAnh || nopLoading}
                        >
                            <Image size={15} />
                            {dangTaiAnh ? "Đang tải tệp lên..." : "Thêm ảnh/video minh chứng"}
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

                    {/* Nút nộp */}
                    <button
                        className="trang-dang-ket-qua-nut-nop"
                        onClick={nopKetQua}
                        disabled={nopLoading || dangTaiAnh}
                    >
                        <Send size={16} />
                        {nopLoading ? "Đang nộp kết quả..." : "Nộp kết quả"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DangKetQuaPage;
