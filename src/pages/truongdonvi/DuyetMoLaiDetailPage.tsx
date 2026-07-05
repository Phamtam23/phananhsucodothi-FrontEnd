import { useState } from "react";
import DuyetKetQuaDetailPage from "./DuyetKetQuaDetailPage";
import { useDuyetMoLai } from "../../hooks/molai/useDuyeMoLai";
import { useDuyetPhieuMoLai } from "../../hooks/phieumolai/useDuyetPhieuMoLai";
import { API_CONFIG } from "../../constants/app.constants";
import { useParams } from "react-router-dom";
import "./DuyetMoLaiDetailPage.scss";

const DuyetMoLaiDetailPage = () => {
     const { maPhieuMoLai } = useParams<{ maPhieuMoLai: string }>();
     const { phieuMoLaiData, loading, error } = useDuyetMoLai({ maPhieuMoLai: maPhieuMoLai || "" });
    const { duyetPhieuMoLai, loading: dangDuyet } = useDuyetPhieuMoLai();

    const [dangTuChoi, setDangTuChoi] = useState(false);
    const [lyDoTuChoi, setLyDoTuChoi] = useState("");

    if (!maPhieuMoLai) return <div className="dkq-error-page">Không tìm thấy thông tin phiếu mở lại.</div>;
    if (loading) return <div className="dkq-loading">Đang tải...</div>;
    if (error) return <div className="dkq-error-page">{error}</div>;
    if (!phieuMoLaiData?.maPhieuPhanCong) return <div className="dkq-error-page">Không tìm thấy thông tin phiếu mở lại.</div>;

    const xacNhanDuyet = async () => {
        if (!window.confirm("Chấp nhận yêu cầu mở lại? Nhân viên sẽ phải làm lại kết quả.")) return;
        try {
            const res = await duyetPhieuMoLai(maPhieuMoLai, true, undefined);
            if (res) {
                alert("Đã duyệt yêu cầu mở lại!");
                window.location.reload();
            } else {
                alert("Lỗi khi duyệt yêu cầu mở lại. Vui lòng thử lại!");
            }
        } catch {
            alert("Lỗi khi duyệt yêu cầu mở lại");
        }
    };

    const xacNhanTuChoi = async () => {
        if (!lyDoTuChoi.trim()) { alert("Vui lòng nhập lý do từ chối"); return; }
        try {
            const res = await duyetPhieuMoLai(maPhieuMoLai, false, lyDoTuChoi);
            if (res) {
                alert("Đã từ chối yêu cầu mở lại!");
                setDangTuChoi(false);
                setLyDoTuChoi("");
                window.location.reload();
            } else {
                alert("Lỗi khi từ chối yêu cầu mở lại. Vui lòng thử lại!");
            }
        } catch {
            alert("Lỗi khi từ chối yêu cầu mở lại");
        }
    };

    return (
        <div className="dkq-molai-container">
            <DuyetKetQuaDetailPage
                maPhieuPhanCong={phieuMoLaiData.maPhieuPhanCong}
                loai="DUYET_MO_LAI"
            />

            <div className="dkq-molai-section">
                <div className="dkq-sidebar-card">
                    <h3>THÔNG TIN YÊU CẦU MỞ LẠI</h3>

                    <div className="dkq-molai-info">
                        <div className="dkq-molai-row">
                            <span className="dkq-molai-label">Lý do mở lại:</span>
                            <p className="dkq-molai-value">{phieuMoLaiData.lyDo}</p>
                        </div>
                        <div className="dkq-molai-row">
                            <span className="dkq-molai-label">Trạng thái:</span>
                            <span className={`dkq-status-tag status-${phieuMoLaiData.trangThaiMoLai?.toLowerCase()}`}>
                                {phieuMoLaiData.trangThaiMoLai}
                            </span>
                        </div>

                        {phieuMoLaiData?.MediaUrls?.length > 0 && (
                            <div className="dkq-molai-row">
                                <span className="dkq-molai-label">Hình ảnh đính kèm:</span>
                                <div className="dkq-molai-medias">
                                    {phieuMoLaiData.MediaUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={`${API_CONFIG.BASE_URL}${url}`}
                                            alt={`Ảnh ${index + 1}`}
                                            className="dkq-molai-img"
                                            onClick={() => window.open(`${API_CONFIG.BASE_URL}${url}`, "_blank")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Nút duyệt / từ chối */}
                        {dangTuChoi ? (
                            <div className="xac-minh-reject-form">
                                <label>LÝ DO TỪ CHỐI MỞ LẠI</label>
                                <textarea
                                    placeholder="Nhập lý do từ chối..."
                                    value={lyDoTuChoi}
                                    onChange={e => setLyDoTuChoi(e.target.value)}
                                    disabled={dangDuyet}
                                />
                                <div className="xac-minh-reject-actions">
                                    <button
                                        className="xac-minh-btn-huy"
                                        onClick={() => { setDangTuChoi(false); setLyDoTuChoi(""); }}
                                        disabled={dangDuyet}
                                    >
                                        HỦY BỎ
                                    </button>
                                    <button
                                        className="xac-minh-btn-xac-nhan"
                                        onClick={xacNhanTuChoi}
                                        disabled={dangDuyet}
                                    >
                                        XÁC NHẬN TỪ CHỐI
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="xac-minh-card-actions">
                                <button
                                    className="xac-minh-btn btn-phan-cong"
                                    onClick={xacNhanDuyet}
                                    disabled={dangDuyet}
                                >
                                    <div className="btn-icon">✓</div> Duyệt Mở Lại
                                </button>
                                <button
                                    className="xac-minh-btn btn-tu-choi"
                                    onClick={() => setDangTuChoi(true)}
                                    disabled={dangDuyet}
                                >
                                    <div className="btn-icon">✕</div> Từ chối
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuyetMoLaiDetailPage;