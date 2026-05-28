import {
  FileText,
  Image as ImageIcon,
  Video,
  Eye
} from "lucide-react";

import type { KetQuaXuLyDetailResponse } from "../../types/KetQuaXuLy";

import KetQuaStatusBadge from "./KetQuaStatusBadge";
import KetQuaMediaGrid from "./KetQuaMediaGrid";
import KetQuaXuLyActions from "./KeQuaXuLyActions";

import "./KetQuaXuLyCard.scss";

type Props = {
  ketQua: KetQuaXuLyDetailResponse;

  role?: "nguoi_dan" | "truong_don_vi";

  dangXuLyHanhDong?: boolean;

  maKetQuaDangTuChoi?: string | null;

  noiDungTuChoi?: string;

  setMaKetQuaDangTuChoi?: (
    id: string | null
  ) => void;

  setNoiDungTuChoi?: (
    value: string
  ) => void;

  duyetKetQua?: (
    maKetQua: string
  ) => void;

  tuChoiKetQua?: (
    maKetQua: string
  ) => void;
};

const KetQuaXuLyCard = ({
  ketQua,

  role = "nguoi_dan",

  dangXuLyHanhDong = false,

  maKetQuaDangTuChoi = null,

  noiDungTuChoi = "",

  setMaKetQuaDangTuChoi,

  setNoiDungTuChoi,

  duyetKetQua,

  tuChoiKetQua

}: Props) => {

  return (
    <div className="ketqua-box">

      <div className="ketqua-box__header">

        <span className="ketqua-box__label">
          Kết quả xử lý của đơn vị
        </span>

        <KetQuaStatusBadge
          trangThai={ketQua.trangThai}
        />

      </div>

      <div className="ketqua-box__content">

        <p className="ketqua-box__time">
          <i
            className="ti ti-clock"
            aria-hidden="true"
          />

          Nộp lúc:
          {" "}
          {new Date(
            ketQua.thoiGianNop
          ).toLocaleString("vi-VN")}
        </p>

        <div className="ketqua-box__noi-dung-box">

          <p className="ketqua-box__title">
            <FileText size={16} />
            Nội dung thực hiện
          </p>

          <p className="ketqua-box__noi-dung">
            {ketQua.noiDungThucHien}
          </p>

        </div>

        {ketQua.medias &&
          ketQua.medias.length > 0 && (

            <KetQuaMediaGrid
              medias={ketQua.medias}
            />

          )}

        {ketQua.lyDoTuChoi && (
          <div className="ketqua-box__tu-choi">

            <strong>
              Lý do từ chối:
            </strong>

            {" "}
            {ketQua.lyDoTuChoi}

          </div>
        )}



      </div>
    </div>
  );
};

export default KetQuaXuLyCard;