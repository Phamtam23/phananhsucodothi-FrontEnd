import type { DonViXuLyResponse } from './../../types/DonViXuLy';
import {useState } from "react";
import {CreatePhanCongService} from "../../services/PhanCongService";
import type { SucoDetailResponse } from "../../types/Suco";
import type {PhieuPhanCongSCResponse,CreatePhieuPhanCongRequest} from "../../types/PhieuPhanCong";

export const useCreatePhanCong = (maSuCo: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [suco, setSuco] =
    useState<SucoDetailResponse | null>(null);

  const [phanCongList, setPhanCongList] =
    useState<PhieuPhanCongSCResponse[]>([]);

  const [donviList, setDonViList] =
    useState<DonViXuLyResponse[]>([]);

  const addDonVi = (donVi: DonViXuLyResponse) => {
    setDonViList((prev) => {
      const exists = prev.some(
        (x) => x.maDonViXuLy === donVi.maDonViXuLy
      );

      if (exists) return prev;

      return [...prev, donVi];
    });
  };

  const removeDonVi = (maDonVi: string) => {
    setDonViList((prev) =>
      prev.filter(
        (x) => x.maDonViXuLy !== maDonVi
      )
    );
  };

  // tạo phân công
  const handleCreatePhanCong = async () => {
    if ( donviList.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const data: CreatePhieuPhanCongRequest = {
        maSuCo: String(maSuCo),
        maDonViXuLy: donviList.map(
          (dv) => dv.maDonViXuLy
        ),
      };

      await CreatePhanCongService(data);
      setDonViList([]);

    } catch {
      setError("Không thể tạo phiếu phân công");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    donviList,
    addDonVi,
    removeDonVi,
    handleCreatePhanCong
  };
};