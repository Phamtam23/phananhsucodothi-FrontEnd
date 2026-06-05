import { useNavigate } from "react-router-dom";
import "./XacMinhPhanAnhPage.scss";
import { useXacMinhPhanAnh } from "../../hooks/xacminhsuco/useXacMinhPhanAnh";
import { ModalDuyetKetQua } from "./ModalDuyetKetQua";
import { ThePhieuPhanCong } from "./components/ThePhieuPhanCong";
import {TheMoLai  } from "./components/TheMoLai";
import { SidebarWidgets } from "./components/SidebarWidgets";
import { TabPhanCong } from "../../components/XacMinh/TabPhanCong";
import { TabMoLai } from "../../components/XacMinh/TabMoLai";

const XacMinhPhanAnhPage = () => {
    const navigate = useNavigate();
    const {
        loading, error, dangTaiMoLai,
        danhSachHienThi, danhSachMoLaiHienThi,
        soChoXacNhan, soDaXacNhan, soMoLai,
        tabChinh, setTabChinh,
        tabPhanCong, setTabPhanCong,
        tabMoLai, setTabMoLai,
        idDangTuChoi, setIdDangTuChoi,
        lyDoTuChoi, setLyDoTuChoi,
        idXemKetQua, setIdXemKetQua,
        idMoLaiTuChoi, setIdMoLaiTuChoi,
        lyDoTuChoiMoLai, setLyDoTuChoiMoLai,
        chapNhanPhieuPhanCong , tuChoiPhieuPhanCong, duyetPhieuMoLaiHanPhanAnh,
    } = useXacMinhPhanAnh();

    if (loading) return <div className="xac-minh-loading">Đang tải...</div>;
    if (error) return <div className="xac-minh-error">{error}</div>

    return (
    <div className="xac-minh-page">

        <header className="xac-minh-header-wrapper">
            <div className="xac-minh-header">
                <h2>Quản lý Công việc</h2>
                <p>
                    Kiểm duyệt phản ánh mới, phân công nhân sự và xét duyệt kết quả xử lý.
                </p>
            </div>

            <div className="xac-minh-main-tabs">
                <button
                    className={`xac-minh-main-tab ${
                        tabChinh === "PHAN_CONG" ? "active" : ""
                    }`}
                    onClick={() => setTabChinh("PHAN_CONG")}
                >
                    Phân công
                </button>

                <button
                    className={`xac-minh-main-tab ${
                        tabChinh === "MO_LAI" ? "active" : ""
                    }`}
                    onClick={() => setTabChinh("MO_LAI")}
                >
                    Mở lại
                </button>
            </div>
        </header>

        {tabChinh === "MO_LAI" && (
            <TabMoLai
                tabHienTai={tabMoLai}
                setTab={setTabMoLai}
                soMoLai={soMoLai}
            />
        )}

        {tabChinh === "PHAN_CONG" && (
            <TabPhanCong
                tabHienTai={tabPhanCong}
                setTab={setTabPhanCong}
                soChoXacNhan={soChoXacNhan}
                soDaXacNhan={soDaXacNhan}
            />
        )}

        <div className="xac-minh-layout">

            <div className="xac-minh-list">

                {tabChinh === "PHAN_CONG" && (
                    <>
                        {danhSachHienThi.length === 0 && (
                            <div className="xac-minh-empty">
                                Không có phản ánh nào ở trạng thái này
                            </div>
                        )}

                        {danhSachHienThi.map(phieu => (
                            <ThePhieuPhanCong
                                key={phieu.maPhieuPhanCong}
                                phieu={phieu}
                                onChapNhan={() =>
                                    chapNhanPhieuPhanCong(
                                        phieu.maPhieuPhanCong
                                    )
                                }
                                onPhanCong={() =>
                                    navigate(
                                        `/truongdonvi/phan-cong/${phieu.maPhieuPhanCong}`
                                    )
                                }
                                onXemChiTiet={() =>
                                    navigate(
                                        `/truongdonvi/phan-cong/${phieu.maPhieuPhanCong}`
                                    )
                                }
                                dangTuChoi={
                                    idDangTuChoi === phieu.maPhieuPhanCong
                                }
                                lyDoTuChoi={lyDoTuChoi}
                                setLyDoTuChoi={setLyDoTuChoi}
                                onBatDauTuChoi={() =>
                                    setIdDangTuChoi(
                                        phieu.maPhieuPhanCong
                                    )
                                }
                                onHuyTuChoi={() => {
                                    setIdDangTuChoi("");
                                    setLyDoTuChoi("");
                                }}
                                onXacNhanTuChoi={() =>
                                    tuChoiPhieuPhanCong(
                                        phieu.maPhieuPhanCong,
                                        lyDoTuChoi
                                    )
                                }
                                dangCapNhat={false}
                                onXemKetQua={() =>
                                    setIdXemKetQua(
                                        phieu.maPhieuPhanCong
                                    )
                                }
                            />
                        ))}
                    </>
                )}

                {tabChinh === "MO_LAI" && (
                    <>
                        {danhSachMoLaiHienThi.length === 0 && (
                            <div className="xac-minh-empty">
                                Không có yêu cầu mở lại nào ở trạng thái này
                            </div>
                        )}

                        {danhSachMoLaiHienThi.map(p => (
                            <TheMoLai
                                key={p.maPhieuMoLai}
                                phieuMoLai={p}
                                dangDuyet={
                                    idDangTuChoi === p.maPhieuMoLai
                                }
                                idDangTuChoi={idDangTuChoi}
                                lyDoTuChoi={lyDoTuChoi}
                                setIdDangTuChoi={setIdDangTuChoi}
                                setLyDoTuChoi={setLyDoTuChoi}
                                onDuyetMoLai={
                                    duyetPhieuMoLaiHanPhanAnh
                                }
                            />
                        ))}
                    </>
                )}

            </div>

         
            <aside className="xac-minh-sidebar">
        <SidebarWidgets pendingCount={0} acceptedCount={0}  />
    </aside>
        </div>

        {idXemKetQua && (
            <ModalDuyetKetQua
                maPhieuPhanCong={idXemKetQua}
                onSuccess={() => setIdXemKetQua("")}
                onClose={() => setIdXemKetQua("")}
            />
        )}

    </div>
);

}

export default XacMinhPhanAnhPage;
