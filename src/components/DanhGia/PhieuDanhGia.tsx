import "./PhieuDanhGia.scss";
import { useState } from "react";
import { useDanhGia } from "../../hooks/suco/useDanhGia";
import { MucDoDanhGia } from "../../types/PhieuDanhGia";
import { Smile, Meh, Frown } from "lucide-react";

interface PhieuDanhGiaProps {
  maKetQuaXuLy: string;
  canDanhGia?: boolean;
  daDanhGia?: boolean;
}

const PhieuDanhGia = ({
  maKetQuaXuLy,
  canDanhGia,
}: PhieuDanhGiaProps) => {
  const {
    danhGia,
    submitDanhGia,
    loading,
  } = useDanhGia(maKetQuaXuLy);

  const [selectedRating, setSelectedRating] = useState<MucDoDanhGia | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeRating = danhGia?.mucDoDanhGia || selectedRating;
  const isSubmitted = !!danhGia;

  const handleGui = async () => {
    if (!selectedRating) return;
    setSubmitting(true);
    try {
      await submitDanhGia({
        maKetQuaXuLy,
        mucDoHaiLong: selectedRating,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="phieu-danh-gia-loading">Đang tải đánh giá...</div>;
  }

  if (!isSubmitted && !canDanhGia) {
    return null;
  }

  return (
    <div className="phieu-danh-gia-card">
      <h3 className="dg-title">Đánh giá chất lượng xử lý</h3>
      
      <div className="dg-smileys-container">
        <button
          type="button"
          disabled={isSubmitted}
          onClick={() => setSelectedRating(MucDoDanhGia.HAI_LONG)}
          className={`dg-smiley-btn dg-smiley-btn--happy ${
            activeRating === MucDoDanhGia.HAI_LONG ? "active" : ""
          } ${isSubmitted ? "disabled" : ""}`}
        >
          <div className="smiley-icon-wrapper">
            <Smile size={36} />
          </div>
          <span className="smiley-label">Hài lòng</span>
        </button>

        <button
          type="button"
          disabled={isSubmitted}
          onClick={() => setSelectedRating(MucDoDanhGia.CHAP_NHAN)}
          className={`dg-smiley-btn dg-smiley-btn--neutral ${
            activeRating === MucDoDanhGia.CHAP_NHAN ? "active" : ""
          } ${isSubmitted ? "disabled" : ""}`}
        >
          <div className="smiley-icon-wrapper">
            <Meh size={36} />
          </div>
          <span className="smiley-label">Chấp nhận</span>
        </button>

        <button
          type="button"
          disabled={isSubmitted}
          onClick={() => setSelectedRating(MucDoDanhGia.KHONG_HAI_LONG)}
          className={`dg-smiley-btn dg-smiley-btn--sad ${
            activeRating === MucDoDanhGia.KHONG_HAI_LONG ? "active" : ""
          } ${isSubmitted ? "disabled" : ""}`}
        >
          <div className="smiley-icon-wrapper">
            <Frown size={36} />
          </div>
          <span className="smiley-label">Không hài lòng</span>
        </button>
      </div>

      {!isSubmitted && canDanhGia && (
        <div className="dg-action-row">
          <button
            type="button"
            className="dg-submit-btn"
            disabled={!selectedRating || submitting}
            onClick={handleGui}
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhieuDanhGia;