import { useState } from "react";
import { useDetailSuco } from "../../hooks/suco/useDetailSuco";
import "./DetailSuCo.scss";
import { API_CONFIG } from "../../constants/app.constants";

type Props = {
  maSuCo: string;
};

const DetailSuCo = ({ maSuCo }: Props) => {
  const { loading, error, suco } = useDetailSuco(maSuCo);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <div className="suco-loading">Đang tải chi tiết sự cố...</div>;
  if (error) return <div className="suco-error">{error}</div>;
  if (!suco) return null;

  const nextSlide = () => {
    if (!suco.medias || suco.medias.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % suco.medias.length);
  };

  const prevSlide = () => {
    if (!suco.medias || suco.medias.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + suco.medias.length) % suco.medias.length);
  };

  return (
    <div className="suco-detail-card">
      <div className="suco-detail-card__header">
        <i className="ti ti-notes icon-phieu" aria-hidden="true" />
        <h2>Nội dung phản ánh từ Công dân</h2>
      </div>

      <div className="suco-detail-card__body">
        <div className="report-text-container">
          <p className="report-text">
            &ldquo;{suco.tieuDe || "Không có tiêu đề phản ánh."}&rdquo;
          </p>
        </div>
        <div className="report-text-container">
          <p className="report-text">
            &ldquo;{suco.noiDung || "Không có nội dung mô tả phản ánh."}&rdquo;
          </p>
        </div>

        <div className="suco-slideshow">
          {suco.medias && suco.medias.length > 0 ? (
            <div className="slideshow-container">
              <div className="slideshow-wrapper">
                <img
                  src={API_CONFIG.BASE_URL + suco.medias[currentSlide].url}
                  alt={`Minh chứng phản ánh ${currentSlide + 1}`}
                  className="slide-image"
                />

                {suco.medias.length > 1 && (
                  <>
                    <button className="slide-arrow prev-arrow" onClick={prevSlide}>
                      &#10094;
                    </button>
                    <button className="slide-arrow next-arrow" onClick={nextSlide}>
                      &#10095;
                    </button>

                    <span className="slide-badge">
                      {currentSlide + 1} / {suco.medias.length}
                    </span>
                  </>
                )}
              </div>

              {suco.medias.length > 1 && (
                <div className="slide-dots">
                  {suco.medias.map((_, index) => (
                    <span
                      key={index}
                      className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
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