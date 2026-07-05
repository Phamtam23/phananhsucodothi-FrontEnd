import { useState, useRef } from "react";
import apiClient from "../../../services/apiClient";
import { useTaoKetQua } from "../../../hooks/ketquaxuly/useTaoKetQua";
import {API_CONFIG} from "../../../constants/app.constants";
import {Image} from "lucide-react";
interface NopKetQuaFormProps {
    maChiTietPhanCong: string;
    onClose: () => void;
}

const NopKetQuaForm = ({maChiTietPhanCong,onClose}: NopKetQuaFormProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { taoKetQua, loading: nopLoading } = useTaoKetQua();
    const [noiDungKetQua, setNoiDungKetQua] = useState("");
    const [anhKetQua, setAnhKetQua] = useState<string[]>([]);
    const [dangTaiAnh, setDangTaiAnh] = useState(false);
   
    const chonAnh = async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
            setDangTaiAnh(true);
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const urlsMoi: string[] = [];
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("files", file);
                formData.append("type", "ketqua");
                const res = await apiClient.post("/file/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const urlData = res.data?.data || res.data?.url;
                urlsMoi.push(urlData);
            }
            setAnhKetQua(prev => [...prev, ...urlsMoi]);
        } catch {
            alert("Tải ảnh thất bại, vui lòng thử lại.");
        } finally {
            setDangTaiAnh(false);
        }
    };

    const xoaAnh = (idx: number) => {
        setAnhKetQua(prev => prev.filter((_, i) => i !== idx));
    }

    const nopKetQua = async () => {
        if (!noiDungKetQua.trim()) {
            alert("Vui lòng nhập nội dung kết quả.");
            return;
        }
        try {
            await taoKetQua({
                maChiTietPhanCong,
                noiDungThucHien: noiDungKetQua,
                mediaUrls: anhKetQua,
            });
            alert("Nộp kết quả thành công! Đang chờ trưởng đơn vị duyệt.");
            onClose();
        } catch {
            alert("Nộp kết quả thất bại. Vui lòng thử lại.");
        }
    }
    return (
        <>
                <div className="modal-ket-qua-nen" onClick={onClose}>
                    <div className="modal-ket-qua-hop" onClick={e => e.stopPropagation()}>
                        <h2> Nộp kết quả xử lý</h2>
                        <div className="ten-su-co">
                            Công việc: #{maChiTietPhanCong}
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
                            <button className="nut-huy-modal" onClick={onClose} disabled={nopLoading}>
                                Hủy
                            </button>
                            <button className="nut-nop-modal" onClick={nopKetQua} disabled={nopLoading || dangTaiAnh}>
                                {nopLoading ? "Đang nộp..." : "Nộp kết quả"}
                            </button>
                        </div>
                    </div>
                </div>
         
     </>
        )
    
    }
export default NopKetQuaForm;