import { useState } from "react";
import { usePhieuPhanCongNhanVien } from "../../../hooks/phancong/usePhieuPhanCongNhanVien";
import { usePhieuKiemDuyetNhanVien } from "../../../hooks/kiemDuyet/usePhieuKiemDuyetNhanVien";
import { defaultPhieuPhanCongFilter } from "../../../types/PhieuPhanCong";
import Pagination from "../../../components/Page/Pagination"
import type {KiemDuyetFilter} from "../../../services/PhieuKiemDuyetService"
type TabType = "phan-cong" | "kiem-duyet";

const defaultKiemDuyetFilter: KiemDuyetFilter = {
    page: 0,
    size: 10,
};
const LichSuPage = () =>{
    const [activeTab, setActiveTab] = useState<TabType>("phan-cong");

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
                        <button onClick={handleResetPC}>Đặt lại</button>
                    </div>

                    {loadingPC ? (
                        <div>Đang tải...</div>
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
                                {dataPC?.content.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: "center" }}>Không có dữ liệu</td></tr>
                                ) : (
                                    dataPC?.content.map(item => (
                                        <tr key={item.maPhieuPhanCong}>
                                            <td>{item.maPhieuPhanCong}</td>
                                            <td>{item.tieuDe}</td>
                                            <td>{item.diaDiem}</td>
                                            <td>{item.trangThai}</td>
                                            <td>{item.thoiGianTao}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    <Pagination
                        currentPage={filterPC.page ?? 0}
                        totalPages={dataPC?.totalPages ?? 0}
                        totalElements={dataPC?.totalElements}
                        pageSize={PAGE_SIZE}
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
                            value={filterKD.page ?? ""}
                            onChange={(e) => setFilterKD(p => ({ ...p, denNgay: e.target.value, page: 0 }))}
                        />
                        <button onClick={handleResetKD}>Đặt lại</button>
                    </div>

                    {loadingKD ? (
                        <div>Đang tải...</div>
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
                                {dataKD?.content.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: "center" }}>Không có dữ liệu</td></tr>
                                ) : (
                                    dataKD?.content.map(item => (
                                        <tr key={item.maKiemDuyet}>
                                            <td>{item.maKiemDuyet}</td>
                                            <td>{item.tieuDe}</td>
                                            <td>{item.diaDiem}</td>
                                            <td>{item.trangThai}</td>
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
    )
}