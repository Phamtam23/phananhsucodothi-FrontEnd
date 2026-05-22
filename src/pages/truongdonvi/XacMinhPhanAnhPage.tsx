import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./XacMinhPhanAnhPage.scss";
import { usePhieuPhanCongDonVi } from "../../hooks/phancong/usePhieuPhanCongDonVi";
import { useUpdatePhieuPhanCong } from "../../hooks/phancong/useUpdatePhieuPhanCong";
import { TrangThaiPhanCong } from "../../types/PhieuPhanCong";
import { usePhieuMoLaiDonVi } from "../../hooks/phieumolai/usePhieuMoLaiDonVi";
import { useDuyetPhieuMoLai } from "../../hooks/phieumolai/useDuyetPhieuMoLai";
import { ModalDuyetKetQua } from "./ModalDuyetKetQua";

// New modular imports
import { IncidentCard } from "./components/IncidentCard";
import { MoLaiRequestCard } from "./components/MoLaiRequestCard";
import { SidebarWidgets } from "./components/SidebarWidgets";

const XacMinhPhanAnhPage = () => {
    const { data, loading, error, refetch } = usePhieuPhanCongDonVi(0, 100);
    const { updatePhieuPhanCong, loading: updating } = useUpdatePhieuPhanCong();
    const navigate = useNavigate();

    // Thay đổi cấu trúc Tab để đỡ rối
    const [mainTab, setMainTab] = useState<"PHAN_CONG" | "MO_LAI">("PHAN_CONG");
    const [subTabPhanCong, setSubTabPhanCong] = useState<"CHO_XAC_NHAN" | "DA_XAC_NHAN" | "DANG_XU_LY" | "CHO_DUYET_KET_QUA" | "HOAN_THANH">("CHO_XAC_NHAN");
    const [subTabMoLai, setSubTabMoLai] = useState<"CHO_PHAN_HOI" | "DA_XU_LY">("CHO_PHAN_HOI");

    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [viewingResultId, setViewingResultId] = useState<string | null>(null);

    // Dữ liệu Phiếu Mở Lại
    const { data: moLaiData, loading: moLaiLoading, refetch: refetchMoLai } = usePhieuMoLaiDonVi(0, 100);
    const { duyetPhieuMoLai, loading: duyetLoading } = useDuyetPhieuMoLai();
    const [rejectingMoLaiId, setRejectingMoLaiId] = useState<string | null>(null);
    const [rejectMoLaiReason, setRejectMoLaiReason] = useState("");

    const handleAccept = async (maPhieu: string) => {
        try {
            await updatePhieuPhanCong(maPhieu, {
                trangThai: TrangThaiPhanCong.DA_XAC_NHAN,
            });
            refetch();
        } catch (e) {
            alert("Lỗi khi tiếp nhận");
        }
    };

    const handleReject = async (maPhieu: string) => {
        if (!rejectReason.trim()) {
            alert("Vui lòng nhập lý do từ chối");
            return;
        }
        try {
            await updatePhieuPhanCong(maPhieu, {
                trangThai: TrangThaiPhanCong.TU_CHOI,
                lyDoTuChoi: rejectReason,
            });
            setRejectingId(null);
            setRejectReason("");
            refetch();
        } catch (e) {
            alert("Lỗi khi từ chối");
        }
    };

    const handleDuyetMoLai = async (maPhieuMoLai: string, isApproved: boolean) => {
        if (!isApproved && !rejectMoLaiReason.trim()) {
            alert("Vui lòng nhập lý do từ chối yêu cầu mở lại");
            return;
        }
        if (isApproved && !window.confirm("Chấp nhận yêu cầu này sẽ yêu cầu nhân viên làm lại kết quả. Bạn có chắc chắn?")) {
            return;
        }

        try {
            await duyetPhieuMoLai(maPhieuMoLai, isApproved, isApproved ? undefined : rejectMoLaiReason);
            alert(isApproved ? "Đã duyệt yêu cầu mở lại!" : "Đã từ chối yêu cầu mở lại!");
            setRejectingMoLaiId(null);
            setRejectMoLaiReason("");
            refetchMoLai();
            refetch(); // Cập nhật lại danh sách công việc chung
        } catch (e) {
            alert("Có lỗi xảy ra khi xử lý yêu cầu mở lại");
        }
    };

    if (loading && !data && mainTab === "PHAN_CONG") return <div className="xac-minh-loading">Đang tải...</div>;
    if (error && mainTab === "PHAN_CONG") return <div className="xac-minh-error">{error}</div>;

    const incidents = data?.content || [];
    const phieuMoLais = moLaiData?.content || [];

    // Tính toán số liệu thống kê
    const pendingCount = incidents.filter(i => i.trangThai === TrangThaiPhanCong.CHO_XAC_NHAN).length;
    const acceptedCount = incidents.filter(i => i.trangThai === TrangThaiPhanCong.DA_XAC_NHAN).length;
    const moLaiCount = phieuMoLais.filter(p => p.trangThaiMoLai === "CHO_PHAN_HOI").length;

    const filteredIncidents = incidents.filter(i => i.trangThai === subTabPhanCong);

    const filteredMoLais = phieuMoLais.filter(p => {
        if (subTabMoLai === "CHO_PHAN_HOI") return p.trangThaiMoLai === "CHO_PHAN_HOI";
        return p.trangThaiMoLai === "CHAP_NHAN" || p.trangThaiMoLai === "TU_CHOI";
    });

    return (
        <div className="xac-minh-page">
            <header className="xac-minh-header">
                <h1>Quản lý Công việc</h1>
                <p>
                    Kiểm duyệt phản ánh mới, phân công nhân sự và xét duyệt kết quả xử lý của đơn vị.
                </p>
            </header>

            <div className="xac-minh-main-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                <button
                    className={`xac-minh-main-tab ${mainTab === "PHAN_CONG" ? "active" : ""}`}
                    onClick={() => setMainTab("PHAN_CONG")}
                    style={{ padding: '8px 16px', fontSize: '16px', fontWeight: mainTab === "PHAN_CONG" ? 'bold' : 'normal', border: 'none', background: 'transparent', color: mainTab === "PHAN_CONG" ? '#059669' : '#6b7280', cursor: 'pointer', borderBottom: mainTab === "PHAN_CONG" ? '2px solid #059669' : 'none', marginBottom: '-10px' }}
                >
                    Danh sách Công việc
                </button>
                <button
                    className={`xac-minh-main-tab ${mainTab === "MO_LAI" ? "active" : ""}`}
                    onClick={() => setMainTab("MO_LAI")}
                    style={{ padding: '8px 16px', fontSize: '16px', fontWeight: mainTab === "MO_LAI" ? 'bold' : 'normal', border: 'none', background: 'transparent', color: mainTab === "MO_LAI" ? '#dc2626' : '#6b7280', cursor: 'pointer', borderBottom: mainTab === "MO_LAI" ? '2px solid #dc2626' : 'none', marginBottom: '-10px' }}
                >
                    Yêu cầu Mở lại {moLaiCount > 0 && <span className="tab-badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', marginLeft: '8px', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{moLaiCount}</span>}
                </button>
            </div>

            {mainTab === "PHAN_CONG" && (
                <div className="xac-minh-tabs">
                    <button
                        className={`xac-minh-tab ${subTabPhanCong === "CHO_XAC_NHAN" ? "active" : ""}`}
                        onClick={() => setSubTabPhanCong("CHO_XAC_NHAN")}
                    >
                        Chờ xác minh <span className="tab-badge">{pendingCount}</span>
                    </button>
                    <button
                        className={`xac-minh-tab ${subTabPhanCong === "DA_XAC_NHAN" ? "active" : ""}`}
                        onClick={() => setSubTabPhanCong("DA_XAC_NHAN")}
                    >
                        Chờ phân công <span className="tab-badge">{acceptedCount}</span>
                    </button>
                    <button
                        className={`xac-minh-tab ${subTabPhanCong === "DANG_XU_LY" ? "active" : ""}`}
                        onClick={() => setSubTabPhanCong("DANG_XU_LY")}
                    >
                        Đang xử lý
                    </button>
                    <button
                        className={`xac-minh-tab ${subTabPhanCong === "CHO_DUYET_KET_QUA" ? "active" : ""}`}
                        onClick={() => setSubTabPhanCong("CHO_DUYET_KET_QUA")}
                    >
                        Chờ duyệt kết quả
                    </button>
                    <button
                        className={`xac-minh-tab ${subTabPhanCong === "HOAN_THANH" ? "active" : ""}`}
                        onClick={() => setSubTabPhanCong("HOAN_THANH")}
                    >
                        Đã thực hiện
                    </button>
                </div>
            )}

            {mainTab === "MO_LAI" && (
                <div className="xac-minh-tabs">
                    <button
                        className={`xac-minh-tab ${subTabMoLai === "CHO_PHAN_HOI" ? "active" : ""}`}
                        onClick={() => setSubTabMoLai("CHO_PHAN_HOI")}
                    >
                        Chờ phản hồi <span className="tab-badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>{moLaiCount}</span>
                    </button>
                    <button
                        className={`xac-minh-tab ${subTabMoLai === "DA_XU_LY" ? "active" : ""}`}
                        onClick={() => setSubTabMoLai("DA_XU_LY")}
                    >
                        Đã xử lý
                    </button>
                </div>
            )}

            <div className="xac-minh-layout">
                <div className="xac-minh-list">
                    {mainTab === "PHAN_CONG" ? (
                        <>
                            {filteredIncidents.map((incident) => (
                                <IncidentCard
                                    key={incident.maPhieuPhanCong}
                                    incident={incident}
                                    onAccept={() => handleAccept(incident.maPhieuPhanCong)}
                                    onAssign={() => navigate(`/truongdonvi/phan-cong/${incident.maPhieuPhanCong}`)}
                                    onViewDetail={() => navigate(`/truongdonvi/phan-cong/${incident.maPhieuPhanCong}`)}
                                    isRejecting={rejectingId === incident.maPhieuPhanCong}
                                    rejectReason={rejectReason}
                                    setRejectReason={setRejectReason}
                                    onStartReject={() => setRejectingId(incident.maPhieuPhanCong)}
                                    onCancelReject={() => {
                                        setRejectingId(null);
                                        setRejectReason("");
                                    }}
                                    onConfirmReject={() => handleReject(incident.maPhieuPhanCong)}
                                    isUpdating={updating}
                                    onViewResult={() => setViewingResultId(incident.maPhieuPhanCong)}
                                />
                            ))}
                            {filteredIncidents.length === 0 && (
                                <div className="xac-minh-empty">Không có dữ liệu trong mục này.</div>
                            )}
                        </>
                    ) : (
                        <>
                            {moLaiLoading ? (
                                <div className="xac-minh-loading">Đang tải yêu cầu mở lại...</div>
                            ) : filteredMoLais.length === 0 ? (
                                <div className="xac-minh-empty">Không có yêu cầu mở lại nào.</div>
                            ) : (
                                filteredMoLais.map(pml => (
                                    <MoLaiRequestCard
                                        key={pml.maPhieuMoLai}
                                        pml={pml}
                                        duyetLoading={duyetLoading}
                                        rejectingMoLaiId={rejectingMoLaiId}
                                        rejectMoLaiReason={rejectMoLaiReason}
                                        setRejectingMoLaiId={setRejectingMoLaiId}
                                        setRejectMoLaiReason={setRejectMoLaiReason}
                                        handleDuyetMoLai={handleDuyetMoLai}
                                    />
                                ))
                            )}
                        </>
                    )}
                </div>

                {viewingResultId && (
                    <ModalDuyetKetQua
                        maPhieuPhanCong={viewingResultId}
                        onClose={() => setViewingResultId(null)}
                        onSuccess={() => refetch()}
                    />
                )}

                <SidebarWidgets
                    pendingCount={pendingCount}
                    acceptedCount={acceptedCount}
                />
            </div>
        </div>
    );
};

export default XacMinhPhanAnhPage;
