import { useState } from "react";
import type { NhanVienDonViResponse } from "../../types/NhanVienDonVi";
import { useCreateChiTietPhanCong } from "../../hooks/phancong/useCreateChiTietPhanCong";
import ListNhanVienDonViPhanCong from "../NhanVienDonVi/ListNhanVienDonViPhanCong";
import type {CreateChiTietPhanCongRequest} from "../../types/ChiTietPhanCong";
type Props = {
  maPhieuPhanCong: string;
  maDonVi: string;
};
const CreateChiTietPhanCong = ({ maDonVi,maPhieuPhanCong }: Props) => {
    const [selectedNhanVien,setSelectedNhanVien ] = useState<NhanVienDonViResponse | null>(null);
    const { createChiTietPhanCong, loading, error } = useCreateChiTietPhanCong();

    const handleSelectNhanVien = ( nhanVien: NhanVienDonViResponse) => {
        if (
            selectedNhanVien?.maNhanVien ===
            nhanVien.maNhanVien
        ) {
            setSelectedNhanVien(null);
            return;
        }
        setSelectedNhanVien(nhanVien);
    };
    
    const handleSubmit = async () => {

    if (!selectedNhanVien) {
      alert("Vui lòng chọn nhân viên");
      return;
    }

    try {
    const data: CreateChiTietPhanCongRequest = {
      maPhieuPhanCong: maPhieuPhanCong,
      maNhanVienXuLy: selectedNhanVien.maNhanVien,
    };
      const result =
        await createChiTietPhanCong(data);

      console.log(result);

      alert("Phân công thành công");

    } catch (err) {

      console.log(err);

    }
  };
   
    if (loading) return <p>Đang tạo chi tiết phân công...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div className="create-chi-tiet-phan-cong">
            <h2>Chi tiết phân công</h2>
        <ListNhanVienDonViPhanCong
                maDonVi={maDonVi}
                selectedNhanVienDonVi={
                selectedNhanVien
                }
                onSelect={handleSelectNhanVien}
            />
          <button
            onClick={handleSubmit}
            disabled={!selectedNhanVien}
        >
            Phân công
        </button>
        </div>
    );
}

export default CreateChiTietPhanCong;