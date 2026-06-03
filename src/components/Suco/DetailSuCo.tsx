import { useDetailSuco } from "../../hooks/suco/useDetailSuco";
import "./DetailSuCo.scss";
import { API_CONFIG } from "../../constants/app.constants";

type Props = {
  maSuCo: string;
};

const DetailSuCo = ({ maSuCo }: Props) => {
  const { loading, error, suco } = useDetailSuco(maSuCo);

  if (loading) return <div className="suco-loading">Đang tải chi tiết sự cố...</div>;
  if (error) return <div className="suco-error">{error}</div>;
  if (!suco) return null;

  return (
    <div className="suco-detail-card">
      <div className="suco-detail-card__header">
        <span className="title-border-left"></span>
        <h2>Nội dung phản ánh</h2>
      </div>

      <div className="suco-detail-card__body">
        <p className="suco-description-text">
          {suco.noiDung || "Không có nội dung mô tả phản ánh."}
        </p>

        <div className="suco-images-gallery">
          {suco.medias && suco.medias.length > 0 ? (
            <div className="suco-images-grid">
              {suco.medias.map((media, index) => (
                <div key={index} className="suco-image-wrapper">
                  <img
                    src={API_CONFIG.BASE_URL + media.url}
                    alt={`Minh chứng phản ánh ${index + 1}`}
                    className="suco-gallery-image"
                  />
                  <div className="suco-image-overlay">
                    <span>Hiện trạng thực tế - Góc {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="slideshow-placeholder">
              <i className="ti ti-image" aria-hidden="true" />
              <span>Không có hình ảnh đính kèm</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailSuCo;