import { useListPhanCong } from "../../hooks/phancong/useListPhanCong";
import KetQuaXuLyCard from "../KetQuaXuLy/KetQuaXuLyCard";
import "./DanhSachPhanCong.scss";
import PhieuDanhGia from "../DanhGia/PhieuDanhGia";
import DanhSachPhieuMoLai from "../MoLai/DanhSachPhieuMoLai";
import FormPhieuMoLai from "../MoLai/FormPhieuMoLai";
import { useState } from "react";

type Props = {
    maSuCo: string;
    type?: "nguoi_dan" | "don_vi";
};

const TRANG_THAI_LABEL: Record<string, string> = {
    CHO_TIEP_NHAN: 'Chờ tiếp nhận',
    DA_TIEP_NHAN: 'Đã tiếp nhận',
    DANG_XU_LY: 'Đang xử lý',
    DA_HOAN_THANH: 'Đã hoàn thành',
    LA_SPAM: 'Spam',
};

const DanhSachPhanCong = ({ maSuCo }: Props) => {
    const { loading, error, phanCongList } = useListPhanCong(maSuCo);
    const [selectedMoLai, setSelectedMoLai] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    if (loading) return <div className="phan-cong-loading">Đang tải danh sách phân công...</div>;
    if (error) return <div className="phan-cong-error">{error}</div>;

    return (
        <div className="danh-sach-phan-cong">
            {phanCongList.map((pc) => (
                <div key={pc.maPhieuPhanCong} className="phan-cong-card">
                    <div className="phan-cong-card__title-row">
                        <div className="title-left">
                            <i className="ti ti-clipboard" />
                            <h3>Kết quả xử lý từ cơ quan chức năng</h3>
                        </div>
                        <span className={`badge badge--${pc.trangThai.toLowerCase()}`}>
                            {TRANG_THAI_LABEL[pc.trangThai]}
                            {pc.trangThai === "HOAN_THANH" && pc.ketQuaXuLyDetailResponse && pc.ketQuaXuLyDetailResponse.length > 0
                                ? `: ${new Date(pc.ketQuaXuLyDetailResponse[pc.ketQuaXuLyDetailResponse.length - 1].thoiGianNop).toLocaleDateString('vi-VN')}`
                                : ""}
                        </span>
                    </div>

                    <div className="phan-cong-card__don-vi-info">
                        <span className="don-vi-label">Đơn vị xử lý:</span>
                        <h4 className="don-vi-ten">{pc.donViXuLy.tenDonVi}</h4>
                    </div>

                
                    {pc.ketQuaXuLyDetailResponse && pc.ketQuaXuLyDetailResponse.length > 0 ? (
                        <>
                            {pc.ketQuaXuLyDetailResponse.map((ketQua, index) => {
                                const isLatest = index === pc.ketQuaXuLyDetailResponse.length - 1;
                                return (
                                    <div key={ketQua.maKetQuaXuLy} className="ket-qua-item">
                                        <KetQuaXuLyCard ketQua={ketQua} role="nguoi_dan" />
                                        
                                        <DanhSachPhieuMoLai 
                                            key={`${ketQua.maKetQuaXuLy}-${reloadKey}`} 
                                            maPhanCong={pc.maPhieuPhanCong} 
                                            maKetQuaXuLy={ketQua.maKetQuaXuLy} 
                                        />

                                        <PhieuDanhGia
                                            maKetQuaXuLy={ketQua.maKetQuaXuLy}
                                            canDanhGia={isLatest ? pc.phieuTrangThaiResponse.canDanhGia : false}
                                            daDanhGia={isLatest ? pc.phieuTrangThaiResponse.daDanhGia : false}
                                        />

                                        {isLatest && pc.phieuTrangThaiResponse.canMoLai && !pc.phieuTrangThaiResponse.daMoLai && (
                                            <div className="vung-mo-lai">
                                                <button
                                                    className={`btn-mo-lai ${selectedMoLai === ketQua.maKetQuaXuLy ? 'danger-btn' : ''}`}
                                                    onClick={() =>
                                                        setSelectedMoLai(
                                                            selectedMoLai === ketQua.maKetQuaXuLy
                                                                ? null
                                                                : ketQua.maKetQuaXuLy
                                                        )
                                                    }
                                                >
                                                    {selectedMoLai === ketQua.maKetQuaXuLy ? "Đóng Form" : "Yêu cầu mở lại xử lý"}
                                                </button>

                                                {selectedMoLai === ketQua.maKetQuaXuLy && (
                                                    <FormPhieuMoLai
                                                        maKetQuaXuLy={ketQua.maKetQuaXuLy}
                                                        onSuccess={() => {
                                                            setSelectedMoLai(null);
                                                            setReloadKey(prev => prev + 1);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {isLatest && pc.phieuTrangThaiResponse.daMoLai && (
                                            <div className="vung-mo-lai">
                                                <p className="da-mo-lai-notice">⚠️ Bạn đã gửi yêu cầu mở lại cho phiếu này.</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <p className="no-ketqua">Chưa có kết quả xử lý từ đơn vị</p>
                    )}
                </div>
            ))}
                {phanCongList.length === 0 && (
                    <div className="phan-cong-trong">Không có thông tin phân công nào cho sự cố này.</div>
                )}
            </div>
        );
};

export default DanhSachPhanCong;
