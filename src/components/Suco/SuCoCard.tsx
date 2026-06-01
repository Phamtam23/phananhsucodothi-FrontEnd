import "./SuCoCard.scss";
import type { TrangThaiSuCo, SucoSumaryResponse } from "../../types/Suco";
import { API_CONFIG } from "../../constants/app.constants";

const TRANG_THAI_CONFIG: Record<TrangThaiSuCo, { label: string; className: string }> = {
  CHO_TIEP_NHAN: { label: 'Chờ tiếp nhận', className: 'badge--cho' },
  DANG_XU_LY: { label: 'Đang xử lý', className: 'badge--xl' },
  DA_HOAN_THANH: { label: 'Đã hoàn thành', className: 'badge--hoan' },
  DA_TIEP_NHAN: { label: 'Đã tiếp nhận', className: 'badge--tiep' },
  LA_SPAM: { label: 'Spam', className: 'badge--spam' },
};
function formatThoiGian(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Hôm qua';
  return `${days} ngày trước`;
}

interface Props {
  suco: SucoSumaryResponse;
  onClick?: (maSuCo: string) => void;
}

const SuCoCard = ({ suco, onClick }: Props) => {
  const { maSuCo, diaDiem, noiDung, trangThai, thoiGianTao, thumbnail } = suco;
  const trangThaiSuCo = TRANG_THAI_CONFIG[trangThai as TrangThaiSuCo] || { label: 'Không xác định', className: 'badge--default' };
  return (
    <div className="suco-card" onClick={() => onClick?.(suco.maSuCo)}>
      <div className="suco-card__img-wrap">
        {suco.thumbnail ? (
          <img
            src={`${API_CONFIG.BASE_URL}${suco.thumbnail}`}
            alt={suco.tieuDe}
            className="suco-card__img"
          />
        ) : (
          <div className="suco-card__img-placeholder" />
        )}
        <div className="suco-card__badges">
          <span className={`badge ${trangThaiSuCo.className}`}>
            {trangThaiSuCo.label}
          </span>
          {/* {suco.loaiSuCo.map((loai) => (
            <span key={loai.maLoai} className="badge badge--loai">
              {loai.tenLoai}
            </span>
          ))} */}
        </div>
      </div>

      <div className="suco-card__body">
        <span className="suco-card__time">
          {formatThoiGian(suco.thoiGianTao)}
        </span>
        <p className="suco-card__title">{suco.tieuDe}</p>
        <p className="suco-card__loc">
          <span className="suco-card__loc-icon"></span>
          {suco.diaDiem}
        </p>
      </div>
    </div>
  );
}

export default SuCoCard;