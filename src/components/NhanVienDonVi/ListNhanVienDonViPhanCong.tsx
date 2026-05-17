import type { NhanVienDonViResponse } from "../../types/NhanVienDonVi";
import { useListNhanVienDonVi } from "../../hooks/nhanviendonvi/useListNhanVienDonViPhanCong";

type Props = {
  maDonVi: string;
  selectedNhanVienDonVi: NhanVienDonViResponse | null;
  onSelect: (dv: NhanVienDonViResponse) => void;
};

const ListNhanVienDonViPhanCong = ({
  maDonVi,
  selectedNhanVienDonVi,
  onSelect,
}: Props) => {

  const {
    listNhanVienDonVi,
    loading,
    error,
  } = useListNhanVienDonVi(maDonVi);

  if (loading) {
    return <p>Đang tải danh sách nhân viên...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (listNhanVienDonVi.length === 0) {
    return <p>Không có nhân viên nào.</p>;
  }

  return (
    <div className="ListNhanVienDonVi">

      <h2>Danh sách nhân viên phân công</h2>

      <ul>
        {listNhanVienDonVi.map((dv) => {

          const isSelected =
            selectedNhanVienDonVi && selectedNhanVienDonVi.maNhanVien === dv.maNhanVien;

          return (
            <li
              key={dv.maNhanVien}
              onClick={() => onSelect(dv)}
              className={isSelected ? "selected" : ""}
            >

              <div className="nhanvien-item">

                <img
                  src={
                    dv.anhDaiDien ||
                    "/default-avatar.png"
                  }
                  alt={dv.hoTen}
                  width={50}
                  height={50}
                />

                <div className="info">
                  <p>{dv.hoTen}</p>

                  <small>
                    {dv.maNhanVien}
                  </small>
                </div>

              </div>

            </li>
          );
        })}
      </ul>

    </div>
  );
};

export default ListNhanVienDonViPhanCong;