import KetQuaXuLyCard from "./KetQuaXuLyCard";
import type { ChiTietVoiKetQua } from "../../hooks/duyetketqua/useDuyetKetQuaDetail";
import DanhSachChiDao from "../ChiDao/DanhSachChiDao";
import { useState } from "react";

interface PropsDanhSachKetQua {
    danhSach: ChiTietVoiKetQua[];
    dangTai: boolean;
    dangXuLy: boolean;
    maKetQuaTuChoi: string | null;
    lyDoTuChoi: string;
    setMaKetQuaTuChoi: (id: string | null) => void;
    setLyDoTuChoi: (lyDo: string) => void;
    duyetKetQua: (maKetQua: string) => void;
    tuChoiKetQua: (maKetQua: string) => void;
}

const DanhSachKetQua = ({
    danhSach, dangTai, dangXuLy,
    maKetQuaTuChoi, lyDoTuChoi,
    setMaKetQuaTuChoi, setLyDoTuChoi,
    duyetKetQua, tuChoiKetQua,
}: PropsDanhSachKetQua) => {
    
    const [showOldResults, setShowOldResults] = useState(false);

    if (dangTai) return <div className="dkq-loading-text">Đang tải kết quả xử lý...</div>;
    if (danhSach.length === 0) return <div className="dkq-empty-msg">Chưa có thông tin phân công.</div>;

    return (
        <div className="dkq-timeline-list">
            {danhSach.map((item, idx) => {
                let latestStatus = "ĐANG CHỜ DUYỆT";
                if (item.danhSachKetQua && item.danhSachKetQua.length > 0) {
                    const latestResult = item.danhSachKetQua[item.danhSachKetQua.length - 1];
                    latestStatus = latestResult.trangThai === "CHO_DUYET" ? "ĐANG CHỜ DUYỆT" : latestResult.trangThai;
                }

                const oldResults = item.danhSachKetQua.filter(kq => kq.trangThai !== "CHO_DUYET");
                const activeResults = item.danhSachKetQua.filter(kq => kq.trangThai === "CHO_DUYET");

                return (
                    <div key={item.maChiTietPhanCong} className="dkq-timeline-block">
                        <div className="timeline-block-header">
                            <div className="badges-left">
                                <span className="timeline-badge new-badge">LẦN {idx + 1} (MỚI)</span>
                                <span className="timeline-badge status-badge">{latestStatus}</span>
                            </div>
                            <span className="timeline-time">
                                {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date().toLocaleDateString('vi-VN')}
                            </span>
                        </div>

                        <div className="timeline-vertical-line">
                            <DanhSachChiDao 
                                chiTietPhanCong={item.maChiTietPhanCong} 
                                nhanVien={item.nhanVienXuLy}
                            />

                            <div className="timeline-results">
                                {item.danhSachKetQua.length === 0 ? (
                                    <div className="timeline-item">
                                        <p className="dkq-empty-msg">Chưa có kết quả.</p>
                                    </div>
                                ) : (
                                    <>
                                        {oldResults.length > 0 && (
                                            <div className="timeline-item old-results-toggle-box">
                                                <button 
                                                    className="btn-toggle-old" 
                                                    onClick={() => setShowOldResults(!showOldResults)}
                                                >
                                                    {showOldResults ? "Ẩn kết quả xử lý cũ" : `Xem ${oldResults.length} kết quả xử lý cũ`}
                                                </button>
                                            </div>
                                        )}

                                        {showOldResults && oldResults.map((kq) => (
                                            <div className="timeline-item result-item old" key={kq.maKetQuaXuLy}>
                                                <div className="result-indicator">
                                                    <span className="indicator-old">Kết quả cũ:</span>
                                                </div>
                                                <KetQuaXuLyCard
                                                    ketQua={kq}
                                                    role="truong_don_vi"
                                                />
                                            </div>
                                        ))}

                                        {activeResults.map((kq) => (
                                            <div className="timeline-item result-item" key={kq.maKetQuaXuLy}>
                                                <div className="result-indicator">
                                                    <span>Báo cáo kết quả:</span>
                                                </div>
                                                <KetQuaXuLyCard
                                                    ketQua={kq}
                                                    role="truong_don_vi"
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DanhSachKetQua;