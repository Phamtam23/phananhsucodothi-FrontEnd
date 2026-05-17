import {useDetailSuco} from "../../hooks/suco/useDetailSuco"
import "./DetailSuCo.scss"
import { API_CONFIG } from "../../constants/app.constants";
import { formatDate, formatDateTime } from '../../utils/Format';
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
const DetailSuCo = ({maSuCo}:Props) =>{
    const {loading,error,suco} = useDetailSuco(maSuCo)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!suco)   return null; 
    return (
      <>
      
     
      <div className="suco-detail">

      <div className="detail-gallery">
        {suco.medias?.length > 0 ? (
          <>
            <div className="gallery__main">
              <img src={API_CONFIG.BASE_URL + suco.medias[0].url} alt={suco.noiDung} />
            </div>
            {suco.medias.length > 1 && (
              <div className="gallery__sub">
                {suco.medias.slice(1, 3).map((m) => (
                  <img key={m.url} src={API_CONFIG.BASE_URL + m.url} alt="" />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="gallery__placeholder" />
        )}
      </div>

      <div className="detail-body">

        {/* 
        {suco.?.length > 0 && (
          <div className="detail-tags">
            {suco.loaiSuCo.map((l) => (
              <span key={l.maLoai} className="tag-loai">
                <i className="ti ti-building-community" aria-hidden="true" />
                {l.tenLoai}
              </span>
            ))}
          </div>
        )} */}

        <h1 className="detail-title">{suco.noiDung}</h1>

        <div className="detail-meta-row">
          <span className={`badge-status badge-status--${suco.trangThai.toLowerCase()}`}>
            {TRANG_THAI_LABEL[suco.trangThai]}
          </span>
          <span className="detail-date">{formatDateTime(suco.thoiGianTao)}</span>
        </div>

        <div className="detail-info-row">
          <i className="ti ti-map-pin" aria-hidden="true" />
          <span>{suco.diaDiem}</span>
        </div>

        <p className="detail-body-text">{suco.noiDung}</p>

        {suco.ngayDuKienHoanThanh && (
          <p className="detail-deadline">
            <i className="ti ti-alarm" aria-hidden="true" />
            Hạn xử lý: {formatDate(suco.ngayDuKienHoanThanh)}
          </p>
        )}
      </div>
       </div>

       { suco.canDanhGia && (
        <div className="detail-evaluation">
          <h2>Đánh giá sự cố</h2>
          <p>Bạn có thể đánh giá chất lượng xử lý sự cố này.</p>
          <button className="btn-evaluate">Đánh giá ngay</button>
        </div>
          
          )}
    </>

    )
}

export default DetailSuCo;