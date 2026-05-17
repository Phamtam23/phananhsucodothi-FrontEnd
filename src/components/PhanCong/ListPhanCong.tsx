import {useListPhanCong} from "../../hooks/phancong/useListPhanCong"
import KetQuaXuLyCard from "../KetQuaXuy/KetQuaXuLyCard"
import "./ListPhanCong.scss"
import PhieuDanhGia from "../DanhGia/PhieuDanhGia";
import ListPhieuMoLai from "../MoLai/ListPhieuMoLai";
import PhieuMoLaiForm from "../../components/MoLai/PhieuMoLaiForm";
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
const ListPhanXong = ({maSuCo}:Props) =>{
      const {loading, error, phanCongList } = useListPhanCong(maSuCo);
      const [selectedMoLai, setSelectedMoLai] = useState<string | null>(null);

      const [reloadKey, setReloadKey] = useState(0);
       if (loading) return <p>Loading...</p>;
       if (error) return <p>{error}</p>;

        return (
          <div className="list-phieu">
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

              <KetQuaXuLyCard
                ketQua={
                  pc.ketQuaXuLyDetailResponse
                }
              />

              <PhieuDanhGia
                maKetQuaXuLy={
                  pc.ketQuaXuLyDetailResponse
                    .maKetQuaXuLy
                }
                canDanhGia={pc.phieuTrangThaiResponse.canDanhGia}
                daDanhGia={pc.phieuTrangThaiResponse.daDanhGia}
              />

            </>
          ) : (
            <p className="no-ketqua">
              Chưa có kết quả xử lý
            </p>
          )}

             <div className="PhieuMoLai">

              <ListPhieuMoLai  key={reloadKey} maPhanCong={pc.maPhieuPhanCong}    />

                        {pc.phieuTrangThaiResponse
                            .canMoLai && (
                            <>
                                <button
                                    className="btn-mo-lai"
                                    onClick={() =>
                                        setSelectedMoLai(
                                            selectedMoLai ===
                                            pc.maPhieuPhanCong
                                                ? null
                                                : pc.maPhieuPhanCong
                                        )
                                    }
                                >
                                    {
                                        selectedMoLai ===
                                        pc.maPhieuPhanCong
                                            ? "Đóng"
                                            : "Yêu cầu mở lại"
                                    }
                                </button>

                                {selectedMoLai ===
                                    pc.maPhieuPhanCong && (

                                    <PhieuMoLaiForm
                                        maKetQuaXuLy={
                                            pc
                                                .ketQuaXuLyDetailResponse
                                                .maKetQuaXuLy
                                        }
                                        onSuccess={() => {

                                            setSelectedMoLai(null);

                                            setReloadKey(
                                                prev => prev + 1
                                            );
                                        }}
                                    />
                                )}

                            </>
                        )}

                    </div>
                </div>
            ))}
            </div>
    );

    }

export default ListPhanXong;