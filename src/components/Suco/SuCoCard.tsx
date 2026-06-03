import "./SuCoCard.scss";
import type { TrangThaiSuCo, SucoSumaryResponse } from "../../types/Suco";
import { API_CONFIG } from "../../constants/app.constants";
import {timeAgo} from "../../utils/Format";

const TRANG_THAI_CONFIG: Record<TrangThaiSuCo, { label: string; className: string }> = {
  CHO_TIEP_NHAN: { label: 'Chờ tiếp nhận', className: 'badge--cho' },
  DANG_XU_LY: { label: 'Đang xử lý', className: 'badge--xl' },
  DA_XU_LY_XONG: { label: 'Đã hoàn thành', className: 'badge--hoan' },
  DA_TIEP_NHAN: { label: 'Đã tiếp nhận', className: 'badge--tiep' },
  TU_CHOI: { label: 'Từ chối', className: 'badge--tu-cho' },
  BO_SUNG: { label: 'Yêu cầu bổ sung', className: 'badge--bo-sung' },
  DA_DONG: { label: 'Đã đóng', className: 'badge--da-dong' },
};


interface Props {
  suco: SucoSumaryResponse;
  type?: 'lich-su' | 'danh-sach';
  onClick?: (maSuCo: string) => void;
  onBoSungClick?: (maSuCo: string) => void;
}



const SuCoCard = ({ suco, onClick,onBoSungClick,type }: Props) => {

  const trangThaiSuCo = TRANG_THAI_CONFIG[suco.trangThai as TrangThaiSuCo] || { label: 'Không xác định', className: 'badge--default' };
  const primaryLoai = suco.loaiSuCos?.[0];
  const moreLoaiCount = Math.max(0, (suco.loaiSuCos?.length ?? 0) - 1);

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
          {primaryLoai && (
            <span className="badge badge--loai">
              {primaryLoai}
            </span>
          )}
          {moreLoaiCount > 0 && (
            <span className="badge badge--more">
              +{moreLoaiCount} loại
            </span>
          )}
        </div>
      </div>

      <div className="suco-card__body">
        <span className="suco-card__time">
          {timeAgo(suco.thoiGianTao)}
        </span>
        <p className="suco-card__title">{suco.tieuDe}</p>
        <p className="suco-card__loc">
          <span className="suco-card__loc-icon"></span>
          {suco.diaDiem}
        </p>
      </div>

      <div className ="action">
          <button className="action__btn">Xem chi tiết</button>
          
          {suco.trangThai === "BO_SUNG" && type==="lich-su" && (
             <button onClick={(e) => {
            e.stopPropagation();
            onBoSungClick?.(suco.maSuCo);
          }} className="action__btn">
            Bổ sung thông tin
          </button>
          )
          }
         
      </div>

    </div>
  );
}

export default SuCoCard;