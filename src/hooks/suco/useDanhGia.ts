import { useEffect, useState } from "react";

import {
  type PhieuDanhGiaRequest,
  type PhieuDanhGiaResponse,
} from "../../types/PhieuDanhGia";

import {
  GetALLByKetQuaXuLy,
  CreatePhieuDanhGiaService,
} from "../../services/DanhGiaService";

export const useDanhGia = (
  maKetQuaXuLy: string
) => {
  const [loading, setLoading] = useState(false);

  const [danhGia, setDanhGia] =
    useState<PhieuDanhGiaResponse | null>(null);

  const loadDanhGia = async () => {
    try {
      setLoading(true);

      const data = await GetALLByKetQuaXuLy(
        maKetQuaXuLy
      );

      console.log("Danh gia da load:", data);

      setDanhGia(data.data);

      return data.data;
    } catch {
      setDanhGia(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitDanhGia = async (
    request: PhieuDanhGiaRequest
  ) => {
    try {
      setLoading(true);

      const data =
        await CreatePhieuDanhGiaService(request);

      setDanhGia(data.data);

      return data.data;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maKetQuaXuLy) {
      loadDanhGia();
    }
  }, [maKetQuaXuLy]);

  return {
    danhGia,
    loadDanhGia,
    submitDanhGia,
    loading,
  };
};