import "./PhieuDanhGia.scss";

import { useDanhGia } from "../../hooks/suco/useDanhGia";

import { MucDoDanhGia } from "../../types/PhieuDanhGia";

interface PhieuDanhGiaProps {
  maKetQuaXuLy: string;
  canDanhGia?: boolean;
  daDanhGia?: boolean;
}

const PhieuDanhGia = ({
  maKetQuaXuLy,
  daDanhGia,
  canDanhGia,
}: PhieuDanhGiaProps) => {

  const {
    danhGia,
    submitDanhGia,
    loading,
  } = useDanhGia(
    maKetQuaXuLy,
    daDanhGia
  );

  const handleDanhGia = async (
    mucDo: MucDoDanhGia
  ) => {
    await submitDanhGia({
      maKetQuaXuLy,
      mucDoHaiLong: mucDo,
    });
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="phieu-danh-gia">

      <h3>Đánh giá kết quả xử lý</h3>

      {daDanhGia ? (
        <div className="danh-gia-da-co">

          <p>Bạn đã đánh giá:</p>

          <strong>

            {danhGia?.mucDoDanhGia ===
              MucDoDanhGia.HAI_LONG &&
              "Hài lòng"}

            {danhGia?.mucDoDanhGia ===
              MucDoDanhGia.CHAP_NHAN &&
              "Chấp nhận"}

            {danhGia?.mucDoDanhGia ===
              MucDoDanhGia.KHONG_HAI_LONG &&
              "Không hài lòng"}

          </strong>

        </div>
      ) : canDanhGia ? (
        <div className="danh-gia-buttons">

          <button
            onClick={() =>
              handleDanhGia(
                MucDoDanhGia.HAI_LONG
              )
            }
          >
            Hài lòng
          </button>

          <button
            onClick={() =>
              handleDanhGia(
                MucDoDanhGia.CHAP_NHAN
              )
            }
          >
            Chấp nhận
          </button>

          <button
            onClick={() =>
              handleDanhGia(
                MucDoDanhGia.KHONG_HAI_LONG
              )
            }
          >
            Không hài lòng
          </button>

        </div>
      ) : (
        <p>Chưa thể đánh giá</p>
      )}

    </div>
  );
};

export default PhieuDanhGia;