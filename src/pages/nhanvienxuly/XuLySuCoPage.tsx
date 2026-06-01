import { useState, useRef } from "react";
import "./XuLySuCoPage.scss";
import { useChiTietPhanCongNhanVien } from "../../hooks/chitietphancong/useChiTietPhanCongNhanVien";
import { TrangThaiChiTietPhanCong, type ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";
import ChiTietPhanCongCard from "../../components/NhanVienDonVi/XuLySuCo/ChiTietPhanCongCard";
const XuLySuCoPage = () => {
    const { data, loading, error, refetch } = useChiTietPhanCongNhanVien(0, 20);
   
    const [tabHienTai, setTabHienTai] = useState< "DANG_XU_LY" | "CHO_DUYET" | "TU_CHOI" | "HOAN_THANH">("DANG_XU_LY");
    const tatCaPhieu = data?.content || [];

    const phieuDangCho = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.DANG_CHO);
    const phieuDangLam = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.DANG_XU_LY);
    const phieuChoDuyet = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.CHO_DUYET);
    const phieuTuChoi = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.TU_CHOI);
    const phieuHoanThanh = tatCaPhieu.filter(p => p.trangThai === TrangThaiChiTietPhanCong.HOAN_THANH);

    const phieuHienThi = tabHienTai === "DANG_XU_LY" ? phieuDangLam
        : tabHienTai === "CHO_DUYET" ? phieuChoDuyet
            : tabHienTai === "TU_CHOI" ? phieuTuChoi
                : phieuHoanThanh;
    if (loading && !data) return <div className="trang-xu-ly-loading">Đang tải dữ liệu...</div>;
    if (error) return <div className="trang-xu-ly-loading" style={{ color: "#ef4444" }}>{error}</div>;

    return (
        <div className="trang-xu-ly">
            <header className="trang-xu-ly-header">
                <h1>Danh sách công việc</h1>
                <p>Quản lý và thực hiện các sự cố được phân công đến bạn.</p>
            </header>

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

            <ChiTietPhanCongCard phieuChiTietPhanCongs={phieuHienThi} />

        </div>
    );
};

export default XuLySuCoPage;
