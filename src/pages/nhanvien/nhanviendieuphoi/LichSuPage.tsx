import { useState, useEffect } from "react";
import { usePhieuPhanCongNhanVien } from "../../../hooks/phancong/usePhieuPhanCongNhanVien";
import { usePhieuKiemDuyetNhanVien } from "../../../hooks/kiemDuyet/usePhieuKiemDuyetNhanVien";
import { defaultPhieuPhanCongFilter } from "../../../types/PhieuPhanCong";
import Pagination from "../../../components/Page/Pagination";
import type { KiemDuyetFilter } from "../../../services/PhieuKiemDuyetService";
import type { DonViXuLyResponse } from "../../../types/DonViXuLy";
import type { LoaiResponse } from "../../../types/Loai";
import { GetAllDonViXuLyService } from "../../../services/DonViXuLy";
import { GetAllLoaiService } from "../../../services/LoaiService";
import "./LichSuPage.scss";

const getBadge = (trangThai: string) => {
    switch (trangThai) {
        case "HOAN_THANH":
            return <span className="badge-lich-su xong">Hoàn thành</span>;
        case "DANG_XU_LY":
            return <span className="badge-lich-su dang">Đang xử lý</span>;
        case "DANG_CHO":
            return <span className="badge-lich-su cho">Chờ xử lý</span>;
        case "TU_CHOI":
            return <span className="badge-lich-su tu-choi">Từ chối</span>;
        default:
            return <span className="badge-lich-su cho">{trangThai}</span>;
    }
};

type TabType = "phan-cong" | "kiem-duyet";

const defaultKiemDuyetFilter: KiemDuyetFilter = { page: 0, size: 10 };

const LichSuPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>("phan-cong");

    // Danh sách đơn vị & loại
    const [danhSachDonVi, setDanhSachDonVi] = useState<DonViXuLyResponse[]>([]);
    const [danhSachLoai, setDanhSachLoai] = useState<LoaiResponse[]>([]);

    useEffect(() => {
        GetAllDonViXuLyService()
            .then(res => setDanhSachDonVi(res.data ?? []))
            .catch(() => {});
        GetAllLoaiService()
            .then(res => setDanhSachLoai(res.data ?? []))
            .catch(() => {});
    }, []);

    // Filter phân công
    const [filterPC, setFilterPC] = useState(defaultPhieuPhanCongFilter);
    const { data: dataPC, loading: loadingPC } = usePhieuPhanCongNhanVien(filterPC);

    // Filter kiểm duyệt
    const [filterKD, setFilterKD] = useState<KiemDuyetFilter>(defaultKiemDuyetFilter);
    const { data: dataKD, loading: loadingKD } = usePhieuKiemDuyetNhanVien(filterKD);

    const handleResetPC = () => setFilterPC(defaultPhieuPhanCongFilter);
    const handleResetKD = () => setFilterKD({ page: 0, size: 10 });

    return (
        <div className="lich-su-page">
            <div className="lich-su-tabs">
                <button
                    className={activeTab === "phan-cong" ? "active" : ""}
                    onClick={() => setActiveTab("phan-cong")}
                >
                    Phân công
                </button>
                <button
                    className={activeTab === "kiem-duyet" ? "active" : ""}
                    onClick={() => setActiveTab("kiem-duyet")}
                >
                    Kiểm duyệt
                </button>
            </div>

            {/* Tab phân công */}
            {activeTab === "phan-cong" && (
                <div>
                    <div className="lich-su-filter">
                        <input
                            type="date"
                            value={filterPC.tuNgay ?? ""}
                            onChange={(e) => setFilterPC(p => ({ ...p, tuNgay: e.target.value, page: 0 }))}
                        />
                        <input
                            type="date"
                            value={filterPC.denNgay ?? ""}
                            onChange={(e) => setFilterPC(p => ({ ...p, denNgay: e.target.value, page: 0 }))}
                        />
                        <select
                            value={filterPC.maDonVi ?? ""}
                            onChange={(e) => setFilterPC(p => ({ ...p, maDonVi: e.target.value || undefined, page: 0 }))}
                            className="filter-select"
                        >
                            <option value="">Tất cả đơn vị</option>
                            {danhSachDonVi.map(dv => (
                                <option key={dv.maDonViXuLy} value={dv.maDonViXuLy}>
                                    {dv.tenDonVi}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterPC.maLoai ?? ""}
                            onChange={(e) => setFilterPC(p => ({ ...p, maLoai: e.target.value || undefined, page: 0 }))}
                            className="filter-select"
                        >
                            <option value="">Tất cả loại</option>
                            {danhSachLoai.map(loai => (
                                <option key={loai.maLoai} value={loai.maLoai}>
                                    {loai.tenLoaiSuCo}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleResetPC}>Đặt lại</button>
                    </div>

                    {loadingPC ? (
                        <div className="lich-su-loading">Đang tải...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tiêu đề</th>
                                    <th>Địa điểm</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!dataPC?.content.length ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center" }}>Không có dữ liệu</td>
                                    </tr>
                                ) : (
                                    dataPC.content.map(item => (
                                        <tr key={item.maPhieuPhanCong}>
                                            <td>{item.maPhieuPhanCong}</td>
                                            <td>{item.tieuDe}</td>
                                            <td>{item.diaDiem}</td>
                                            <td>{getBadge(item.trangThai)}</td>
                                            <td>{item.thoiGianTao}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    <Pagination
                        currentPage={filterPC.page ?? 0}
                        totalPages={dataPC?.pagination.totalPages ?? 0}
                        totalElements={dataPC?.pagination.totalElements}
                        pageSize={10}
                        onPageChange={(p) => setFilterPC(prev => ({ ...prev, page: p }))}
                    />
                </div>
            )}

            {/* Tab kiểm duyệt */}
            {activeTab === "kiem-duyet" && (
                <div>
                    <div className="lich-su-filter">
                        <input
                            type="date"
                            value={filterKD.tuNgay ?? ""}
                            onChange={(e) => setFilterKD(p => ({ ...p, tuNgay: e.target.value, page: 0 }))}
                        />
                        <input
                            type="date"
                            value={filterKD.denNgay ?? ""}
                            onChange={(e) => setFilterKD(p => ({ ...p, denNgay: e.target.value, page: 0 }))}
                        />
                        <button onClick={handleResetKD}>Đặt lại</button>
                    </div>

                    {loadingKD ? (
                        <div className="lich-su-loading">Đang tải...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tiêu đề</th>
                                    <th>Địa điểm</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!dataKD?.content.length ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center" }}>Không có dữ liệu</td>
                                    </tr>
                                ) : (
                                    dataKD.content.map(item => (
                                        <tr key={item.maKiemDuyet}>
                                            <td>{item.maKiemDuyet}</td>
                                            <td>{item.tieuDe}</td>
                                            <td>{item.diaDiem}</td>
                                            <td>{getBadge(item.trangThai)}</td>
                                            <td>{item.thoiGianTao}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    <Pagination
                        currentPage={filterKD.page ?? 0}
                        totalPages={dataKD?.pagination.totalPages ?? 0}
                        totalElements={dataKD?.pagination.totalElements}
                        pageSize={10}
                        onPageChange={(p) => setFilterKD(prev => ({ ...prev, page: p }))}
                    />
                </div>
            )}
        </div>
    );
};

export default LichSuPage;