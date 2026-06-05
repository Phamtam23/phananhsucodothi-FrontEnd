import { useDetailSuco } from "../../hooks/suco/useDetailSuco";
import "./DetailSuCo.scss";
import { API_CONFIG } from "../../constants/app.constants";
import {formatDateTime} from "../../utils/Format";
import {getLableTrangThaiSuco,getColorTrangThaiSuco} from "../../utils/StatusUtils";
import diaDiemIcon from "../../assets/location-pin.png";
type Props = {
  maSuCo: string;
};
import { useState } from "react";

const DetailSuCo = ({ maSuCo }: Props) => {
  const { loading, error, suco } = useDetailSuco(maSuCo);
  const [currentIndex, setCurrentIndex] = useState(0);
  if (loading) return <div className="suco-loading">Đang tải chi tiết sự cố...</div>;
  if (error) return <div className="suco-error">{error}</div>;
  if (!suco) return null;
  const medias = suco.medias ?? [];
  const total = medias.length;

  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);
  return (
    <div className="suco-detail-card">
        <div className="suco-slideshow">
        {total > 0 ? (
          <>
            <div className="suco-slide">
              <img
                src={API_CONFIG.BASE_URL + medias[currentIndex].url}
                alt={`Minh chứng phản ánh ${currentIndex + 1}`}
                className="suco-slide__img"
              />
              <div className="suco-slide__overlay">
                Hiện trạng thực tế – Góc {currentIndex + 1}
              </div>
            </div>

            {total > 1 && (
              <>
                <button className="suco-slide__btn suco-slide__btn--prev" onClick={prev}>
                  ‹
                </button>
                <button className="suco-slide__btn suco-slide__btn--next" onClick={next}>
                  ›
                </button>
                <div className="suco-slide__dots">
                  {medias.map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${i === currentIndex ? "dot--active" : ""}`}
                      onClick={() => setCurrentIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="slideshow-placeholder">
            <i className="ti ti-image" aria-hidden="true" />
            <span>Không có hình ảnh đính kèm</span>
          </div>
        )}
      </div>

      <div className="suco_loai">
        {suco.loaiSuCos && suco.loaiSuCos.length > 0 ? (
          suco.loaiSuCos.map((loai, index) => (
            <span key={index} className="loai-label">
              {loai}
            </span>
          ))
        ) : (
          <span className="loai-label">Chưa phân loại</span>
        )}
      </div>
      <br/>
      <div className="suco-tieude">{suco.tieuDe}</div>
      <div className ="suco-trangthai-ngaytao"> 
        <div className={`trangthai ${getColorTrangThaiSuco(suco.trangThai)}`}>{getLableTrangThaiSuco(suco.trangThai)}</div>
        <div className="ngaytao">Ngày tạo: {formatDateTime(suco.thoiGianTao)}</div>
      </div>
      <br/>
      <div className="suco-diadiem"> <img src={diaDiemIcon} alt="" /> {suco.diaDiem}</div>
      <br/> 
      <div className="suco-detail-card__body">
        <p className="suco-description-text">
          {suco.noiDung || "Không có nội dung mô tả phản ánh."}
        </p>
      </div>
    </div>
  );
};

export default DetailSuCo;