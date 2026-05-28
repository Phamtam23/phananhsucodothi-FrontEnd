import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import "./DuyetKetQuaDetailPage.scss";
import { usePhieuPhanCongDetail } from "../../hooks/phancong/usePhieuPhanCongDetail";
import { useDuyetKetQuaDetail } from "../../hooks/duyetketqua/useDuyetKetQuaDetail";
import DetailSuCo from "../../components/Suco/DetailSuCo";
import DanhSachKetQua from "../../components/KetQuaXuLy/DanhSachKetQua";

interface PropsDuyetKetQuaDetailPage {
    maPhieuPhanCong: string;
    loai: "DUYET_KET_QUA" | "DUYET_MO_LAI";
}

const DuyetKetQuaDetailPage = ({maPhieuPhanCong,loai}:PropsDuyetKetQuaDetailPage) => {
    const navigate = useNavigate();    
    const { detail: phanCong, loading: dangTaiPhanCong } = usePhieuPhanCongDetail(maPhieuPhanCong);
    
    const {
        danhSachTheoChiTiet, dangTai, dangXuLy,
        maKetQuaTuChoi, setMaKetQuaTuChoi,
        lyDoTuChoi, setLyDoTuChoi,
        duyetKetQua, tuChoiKetQua,
    } = useDuyetKetQuaDetail(maPhieuPhanCong || "");

    const [showTimeline, setShowTimeline] = useState(false);

    if (!maPhieuPhanCong) {
        return null;
    }

    if (dangTaiPhanCong) return <div className="dkq-loading-page">Đang tải thông tin...</div>;
    if (!phanCong) return <div className="dkq-error-page">Không tìm thấy thông tin phân công.</div>;

    const suCo = phanCong.suCoDetail;

    // Find the latest CHO_DUYET result to show in the sidebar
    let ketQuaChoDuyet: any = null;
    if (danhSachTheoChiTiet) {
        Array.from(danhSachTheoChiTiet.values()).forEach(chiTietList => {
            chiTietList.forEach(chiTiet => {
                chiTiet.danhSachKetQua.forEach(kq => {
                    if (kq.trangThai === "CHO_DUYET") {
                        ketQuaChoDuyet = kq;
                    }
                });
            });
        });
    }
return (
    <div className="dkq-page">
        <header className="dkq-header">
            <div className="dkq-header-top">
                <button className="dkq-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Phản ánh &gt; #{phanCong.maPhieuPhanCong}
                </button>

                <div className="dkq-tags">
                    <span className={`dkq-status-tag status-${phanCong.trangThai.toLowerCase()}`}>
                        {phanCong.trangThai}
                    </span>
                </div>
            </div>

            <div className="dkq-header-main">
                <h1>Chi Tiết Phản Ánh & Duyệt Kết Quả</h1>
                <p className="dkq-subtitle">
                    Đối chiếu và phê duyệt báo cáo xử lý hiện trường.
                </p>
            </div>
        </header>

        <div className="dkq-content">

            {/* MAIN */}
            <div className="dkq-main-col">

                <div className="dkq-suco-wrapper">
                    {suCo?.maSuCo ? (
                        <DetailSuCo maSuCo={suCo.maSuCo} />
                    ) : (
                        <div className="dkq-card">
                            <p className="dkq-empty-msg">
                                Không tìm thấy thông tin sự cố.
                            </p>
                        </div>
                    )}
                </div>

                <div className="dkq-timeline-section">

                    <div className="dkq-timeline-header">
                        <div className="dkq-timeline-header-left">
                            <h2>DÒNG THỜI GIAN XỬ LÝ</h2>
                            <span className="dkq-timeline-tag">
                                1 NHÂN SỰ
                            </span>
                        </div>

                        <button
                            className="btn-toggle-timeline"
                            onClick={() => setShowTimeline(!showTimeline)}
                        >
                            {showTimeline
                                ? "Đóng lịch sử"
                                : "Xem lịch sử thực hiện"}

                            {showTimeline
                                ? <ChevronUp size={16} />
                                : <ChevronDown size={16} />
                            }
                        </button>
                    </div>

                    {showTimeline && (
                        <div className="dkq-timeline-content">

                            {Array.from(danhSachTheoChiTiet.entries()).map(
                                ([maChiTiet, chiTiet]) => (
                                    <DanhSachKetQua
                                        key={maChiTiet}
                                        danhSach={chiTiet}
                                        dangTai={dangTai}
                                        dangXuLy={dangXuLy}
                                        maKetQuaTuChoi={maKetQuaTuChoi}
                                        lyDoTuChoi={lyDoTuChoi}
                                        setMaKetQuaTuChoi={setMaKetQuaTuChoi}
                                        setLyDoTuChoi={setLyDoTuChoi}
                                        duyetKetQua={duyetKetQua}
                                        tuChoiKetQua={tuChoiKetQua}
                                    />
                                )
                            )}

                        </div>
                    )}

                </div>
            </div>

            {/* SIDEBAR */}
            <div className="dkq-sidebar">

                <div className="dkq-sidebar-card approval-card">

                    <h3>PHÊ DUYỆT KẾT QUẢ</h3>

                    {ketQuaChoDuyet ? (
                        <div className="approval-form">

                            <label>GHI CHÚ PHÊ DUYỆT</label>

                            <textarea
                                placeholder="Nhập nhận xét hoặc chỉ đạo phê duyệt..."
                                value={lyDoTuChoi}
                                onChange={(e) => setLyDoTuChoi(e.target.value)}
                                disabled={dangXuLy}
                            />

                            <button
                                className="btn-approve"
                                disabled={dangXuLy}
                                onClick={() =>
                                    duyetKetQua(ketQuaChoDuyet.maKetQuaXuLy)
                                }
                            >
                                DUYỆT KẾT QUẢ
                            </button>

                            <button
                                className="btn-reject"
                                disabled={dangXuLy}
                                onClick={() =>
                                    tuChoiKetQua(ketQuaChoDuyet.maKetQuaXuLy)
                                }
                            >
                                YÊU CẦU LÀM LẠI
                            </button>

                        </div>
                    ) : (
                        <p className="no-approval-msg">
                            Không có kết quả nào đang chờ duyệt.
                        </p>
                    )}

                </div>

                {loai === "DUYET_KET_QUA" && (
                    <>
                        <div className="dkq-sidebar-card stats-card">

                            <h3>CHI TIẾT THỰC HIỆN</h3>

                            <div className="stats-main">
                                <span className="stats-label">
                                    Tổng thời gian
                                </span>

                                <span className="stats-value">
                                    04 Ngày
                                </span>
                            </div>

                            <div className="stats-progress-bar">
                                <div className="progress-fill"></div>
                            </div>

                            <ul className="stats-list">

                                <li>
                                    <span>Số lượt nộp</span>
                                    <strong>03 lượt</strong>
                                </li>

                                <li>
                                    <span>Nhân sự</span>
                                    <strong>01 chính, 0 hỗ trợ</strong>
                                </li>

                                <li>
                                    <span>Độ ưu tiên</span>
                                    <span className="priority-tag">
                                        CAO
                                    </span>
                                </li>

                            </ul>
                        </div>

                        <div className="dkq-sidebar-row">

                            <div className="dkq-sidebar-card small-card">
                                <i className="ti ti-map-alt"></i>
                                <span>KHU VỰC</span>
                                <strong>HUE-CBD-09</strong>
                            </div>

                            <div className="dkq-sidebar-card small-card">
                                <i className="ti ti-target"></i>
                                <span>TỌA ĐỘ</span>
                                <strong>16.467, 107.591</strong>
                            </div>

                        </div>
                    </>
                )}

            </div>
        </div>
    </div>
);
}
export default DuyetKetQuaDetailPage;