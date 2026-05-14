import {useListPhanCong} from "../../hooks/phancong/useListPhanCong"
import KetQuaXuLyCard from "../KetQuaXuy/KetQuaXuLyCard"
import "./ListPhanCong.scss"
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

                {pc.ketQuaXuLyDetailResponse
                    ? <KetQuaXuLyCard ketQua={pc.ketQuaXuLyDetailResponse} />
                    : <p className="no-ketqua">Chưa có kết quả xử lý</p>
                }
                </div>
            ))}
            </div>
    );

    }

export default ListPhanXong;