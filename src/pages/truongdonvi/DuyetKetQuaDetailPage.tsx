import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import "./DuyetKetQuaDetailPage.scss";

import { usePhieuPhanCongDetail } from "../../hooks/phancong/usePhieuPhanCongDetail";

import {
    GetChiTietPhanCongByPhanCongIdService
} from "../../services/ChiTietPhanCongService";

import {
    GetKetQuaXuLyByChiTietPhanCongIdService,
    DuyetKetQuaXuLyService
} from "../../services/KetQuaXuLyService";

import type { ChiTietPhanCongResponse } from "../../types/ChiTietPhanCong";

import {
    TrangThaiKetQua,
    type KetQuaXuLyDetailResponse
} from "../../types/KetQuaXuLy";

import DetailSuCo from "../../components/Suco/DetailSuCo";

import KetQuaXuLyCard
    from "../../components/KetQuaXuLy/KetQuaXuLyCard";

interface ChiTietWithKetQua extends ChiTietPhanCongResponse {
    ketQuaList: KetQuaXuLyDetailResponse[];
}

const DuyetKetQuaDetailPage = () => {

    const { id: maPhieuPhanCong } =
        useParams<{ id: string }>();

    const navigate = useNavigate();

    const {
        detail: phanCong,
        loading: loadingPhanCong
    } = usePhieuPhanCongDetail(maPhieuPhanCong);

    const [danhSach, setDanhSach] =
        useState<ChiTietWithKetQua[]>([]);

    const [loadingResults, setLoadingResults] =
        useState(true);

    const [dangXuLyHanhDong, setDangXuLyHanhDong] =
        useState(false);

    const [maKetQuaDangTuChoi, setMaKetQuaDangTuChoi] =
        useState<string | null>(null);

    const [noiDungTuChoi, setNoiDungTuChoi] =
        useState("");

    const fetchResultsData = async () => {

        if (!maPhieuPhanCong) return;

        setLoadingResults(true);

        try {

            const chiTietRes =
                await GetChiTietPhanCongByPhanCongIdService(
                    maPhieuPhanCong
                );

            if (chiTietRes.status === 200 && chiTietRes.data) {

                const chiTietList = chiTietRes.data;

                const fullData = await Promise.all(

                    chiTietList.map(async (ct) => {

                        try {

                            const kqRes =
                                await GetKetQuaXuLyByChiTietPhanCongIdService(
                                    ct.maChiTietPhanCong
                                );

                            return {
                                ...ct,
                                ketQuaList: kqRes.data || []
                            };

                        } catch {

                            return {
                                ...ct,
                                ketQuaList: []
                            };
                        }
                    })
                );

                setDanhSach(fullData);
            }

        } catch (error) {

            console.error(
                "Lỗi lấy dữ liệu kết quả",
                error
            );

        } finally {

            setLoadingResults(false);
        }
    };

    useEffect(() => {

        fetchResultsData();

    }, [maPhieuPhanCong]);

    const handleDuyet = async (
        maKetQua: string
    ) => {

        const confirm =
            window.confirm(
                "Bạn có chắc chắn muốn duyệt kết quả này?"
            );

        if (!confirm) return;

        setDangXuLyHanhDong(true);

        try {

            await DuyetKetQuaXuLyService(
                maKetQua,
                true
            );

            alert("Duyệt kết quả thành công!");

            fetchResultsData();

        } catch {

            alert("Lỗi khi duyệt kết quả");

        } finally {

            setDangXuLyHanhDong(false);
        }
    };

    const handleTuChoi = async (
        maKetQua: string
    ) => {

        if (!noiDungTuChoi.trim()) {

            alert(
                "Vui lòng nhập lý do từ chối."
            );

            return;
        }

        setDangXuLyHanhDong(true);

        try {

            await DuyetKetQuaXuLyService(
                maKetQua,
                false,
                noiDungTuChoi
            );

            alert(
                "Đã từ chối kết quả!"
            );

            setMaKetQuaDangTuChoi(null);

            setNoiDungTuChoi("");

            fetchResultsData();

        } catch {

            alert("Lỗi khi từ chối");

        } finally {

            setDangXuLyHanhDong(false);
        }
    };

    if (loadingPhanCong) {

        return (
            <div className="dkq-loading-page">
                Đang tải thông tin...
            </div>
        );
    }

    if (!phanCong) {

        return (
            <div className="dkq-error-page">
                Không tìm thấy thông tin phân công.
            </div>
        );
    }

    const suco = phanCong.suCoDetail;

    return (

        <div className="dkq-page">

            <header className="dkq-header">

                <div className="dkq-header-top">

                    <button
                        className="dkq-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                        Quay lại danh sách
                    </button>

                    <div className="dkq-tags">

                        <span className="dkq-status-tag">
                            TRÌNH TRẠNG:
                            {phanCong.trangThai}
                        </span>

                        <span className="dkq-id-tag">
                            ID PHIẾU:
                            #{phanCong.maPhieuPhanCong}
                        </span>

                    </div>

                </div>

                <div className="dkq-header-main">
                    <h1>
                        Chi Tiết Phản Ánh &
                        Duyệt Kết Quả
                    </h1>
                </div>

            </header>

            <div className="dkq-content">

                {/* LEFT */}

                <div className="dkq-left-col">

                    {suco?.maSuCo ? (

                        <DetailSuCo
                            maSuCo={suco.maSuCo}
                        />

                    ) : (

                        <div className="dkq-card">
                            <p className="dkq-empty-msg">
                                Không tìm thấy thông tin sự cố.
                            </p>
                        </div>
                    )}

                </div>

                {/* RIGHT */}

                <div className="dkq-right-col">

                    {danhSach.length > 0 &&
                        danhSach[0].nhanVienXuLy && (

                            <div className="dkq-card dkq-staff-card">

                                <div className="dkq-card-header">

                                    <span className="dkq-section-label">
                                        NHÂN SỰ PHỤ TRÁCH
                                    </span>

                                </div>

                                <div className="dkq-staff-info-box">

                                    <div className="dkq-staff-avatar">

                                        {danhSach[0].nhanVienXuLy.anhDaiDien ? (

                                            <img
                                                src={
                                                    danhSach[0]
                                                        .nhanVienXuLy
                                                        .anhDaiDien
                                                }
                                                alt="avatar"
                                            />

                                        ) : (

                                            <User size={24} />
                                        )}

                                    </div>

                                    <div className="dkq-staff-details">

                                        <span className="staff-role">
                                            NHÂN VIÊN ĐƠN VỊ
                                        </span>

                                        <h4 className="staff-name">
                                            {
                                                danhSach[0]
                                                    .nhanVienXuLy
                                                    .hoTen
                                            }
                                        </h4>

                                        <span className="staff-team">
                                            Mã nhân viên:
                                            {
                                                danhSach[0]
                                                    .nhanVienXuLy
                                                    .maNhanVien
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>
                        )}

                    <div className="dkq-card dkq-results-card">

                        <div className="dkq-card-header">

                            <span className="dkq-section-label">
                                KẾT QUẢ XỬ LÝ
                            </span>

                        </div>

                        {loadingResults ? (

                            <div className="dkq-loading-text">
                                Đang tải kết quả xử lý...
                            </div>

                        ) : danhSach.length === 0 ? (

                            <div className="dkq-empty-msg">
                                Chưa có thông tin phân công.
                            </div>

                        ) : (

                            <div className="dkq-results-list">

                                {danhSach.map((ct) => (

                                    <div
                                        key={ct.maChiTietPhanCong}
                                        className="dkq-assignment-block"
                                    >

                                        {ct.ketQuaList.length === 0 ? (

                                            <p className="dkq-no-result">
                                                Nhân viên chưa nộp kết quả.
                                            </p>

                                        ) : (

                                            [...ct.ketQuaList]

                                                .sort((a, b) => {

                                                    if (
                                                        a.trangThai === TrangThaiKetQua.CHO_DUYET &&
                                                        b.trangThai !== TrangThaiKetQua.CHO_DUYET
                                                    ) {
                                                        return -1;
                                                    }

                                                    if (
                                                        a.trangThai !== TrangThaiKetQua.CHO_DUYET &&
                                                        b.trangThai === TrangThaiKetQua.CHO_DUYET
                                                    ) {
                                                        return 1;
                                                    }

                                                    return (
                                                        new Date(
                                                            b.thoiGianNop
                                                        ).getTime()
                                                        -
                                                        new Date(
                                                            a.thoiGianNop
                                                        ).getTime()
                                                    );
                                                })

                                                .map((kq) => (

                                                    <KetQuaXuLyCard

                                                        key={
                                                            kq.maKetQuaXuLy
                                                        }

                                                        ketQua={kq}

                                                        role="truong_don_vi"

                                                        dangXuLyHanhDong={
                                                            dangXuLyHanhDong
                                                        }

                                                        maKetQuaDangTuChoi={
                                                            maKetQuaDangTuChoi
                                                        }

                                                        noiDungTuChoi={
                                                            noiDungTuChoi
                                                        }

                                                        setMaKetQuaDangTuChoi={
                                                            setMaKetQuaDangTuChoi
                                                        }

                                                        setNoiDungTuChoi={
                                                            setNoiDungTuChoi
                                                        }

                                                        duyetKetQua={
                                                            handleDuyet
                                                        }

                                                        tuChoiKetQua={
                                                            handleTuChoi
                                                        }
                                                    />
                                                ))
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default DuyetKetQuaDetailPage;

