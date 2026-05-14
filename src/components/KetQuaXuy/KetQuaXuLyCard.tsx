import type { KetQuaXuLyDetailResponse } from "../../types/KetQuaXuLy";

type Props = {
    ketQua: KetQuaXuLyDetailResponse;
};

const KetQuaXuLyCard = ({ ketQua }: Props) => {
  return (
    <div className="ketqua-box">
      <span className="ketqua-box__label">Kết quả xử lý</span>
      <div className="ketqua-box__content">
        <p className="ketqua-box__time">
          <i className="ti ti-clock" aria-hidden="true" />
          Nộp lúc: {new Date(ketQua.thoiGianNop).toLocaleString('vi-VN')}
        </p>
        <p className="ketqua-box__noi-dung">{ketQua.noiDungThucHien}</p>
        {ketQua.medias?.length > 0 && (
          <div className="media-list">
            {ketQua.medias.map((media) => (
              <img key={media.url} src={media.url} alt="Kết quả xử lý" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KetQuaXuLyCard;