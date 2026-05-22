import { useListPhanCong } from "../../hooks/phancong/useListPhanCong";
import KetQuaXuLyCard from "../KetQuaXuLy/KetQuaXuLyCard";
import "./DanhSachPhanCong.scss";
import PhieuDanhGia from "../DanhGia/PhieuDanhGia";
import DanhSachPhieuMoLai from "../MoLai/DanhSachPhieuMoLai";
import FormPhieuMoLai from "../MoLai/FormPhieuMoLai";
import { useState } from "react";

type Props = {
    maSuCo: string;
};

const TRANG_THAI_LABEL: Record<string, string> = {
  CHO_TIEP_NHAN: 'Chờ tiếp nhận',
  DA_TIEP_NHAN:  'Đã tiếp nhận',
  DANG_XU_LY:    'Đang xử lý',
  DA_HOAN_THANH: 'Đã hoàn thành',
  LA_SPAM:       'Spam',
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
                    <div className="phan-cong-card__header">
                        <div className="phan-cong-card__don-vi">
                            <div className="don-vi-avatar">
                                {pc.donViXuLy.tenDonVi.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="don-vi-ten">{pc.donViXuLy.tenDonVi}</p>
                                <p className="don-vi-time">
                                    {new Date(pc.thoiGianTao).toLocaleString('vi-VN')}
                                </p>
                            </div>
                        </div>
                        <span className={`badge badge--${pc.trangThai.toLowerCase()}`}>
                            {TRANG_THAI_LABEL[pc.trangThai]}
                        </span>
                    </div>

                    {pc.ketQuaXuLyDetailResponse ? (
                        <>
                            <KetQuaXuLyCard ketQua={pc.ketQuaXuLyDetailResponse} />
                            <PhieuDanhGia
                                maKetQuaXuLy={pc.ketQuaXuLyDetailResponse.maKetQuaXuLy}
                                canDanhGia={pc.phieuTrangThaiResponse.canDanhGia}
                                daDanhGia={pc.phieuTrangThaiResponse.daDanhGia}
                            />
                        </>
                    ) : (
                        <p className="no-ketqua">Chưa có kết quả xử lý từ đơn vị</p>
                    )}

                    <div className="vung-mo-lai">
                        <DanhSachPhieuMoLai key={reloadKey} maPhanCong={pc.maPhieuPhanCong} />

                        {pc.phieuTrangThaiResponse.canMoLai && (
                            <>
                                <button
                                    className={`btn-mo-lai ${selectedMoLai === pc.maPhieuPhanCong ? 'danger-btn' : ''}`}
                                    onClick={() =>
                                        setSelectedMoLai(
                                            selectedMoLai === pc.maPhieuPhanCong
                                                ? null
                                                : pc.maPhieuPhanCong
                                        )
                                    }
                                >
                                    {selectedMoLai === pc.maPhieuPhanCong ? "Đóng Form" : "Yêu cầu mở lại xử lý"}
                                </button>

                                {selectedMoLai === pc.maPhieuPhanCong && (
                                    <FormPhieuMoLai
                                        maKetQuaXuLy={pc.ketQuaXuLyDetailResponse.maKetQuaXuLy}
                                        onSuccess={() => {
                                            setSelectedMoLai(null);
                                            setReloadKey(prev => prev + 1);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))}
            {phanCongList.length === 0 && (
                <div className="phan-cong-trong">Không có thông tin phân công nào cho sự cố này.</div>
            )}
        </div>
    );
};

export default DanhSachPhanCong;
