import { useState } from "react";
import { CreateChiTietPhanCongService } from "../../services/ChiTietPhanCongService";

import type {CreateChiTietPhanCongRequest,ChiTietPhanCongResponse} from "../../types/ChiTietPhanCong";

export const useCreateChiTietPhanCong = () => {

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const createChiTietPhanCong = async (
    data: CreateChiTietPhanCongRequest
  ): Promise<ChiTietPhanCongResponse> => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await CreateChiTietPhanCongService(data);

      return response.data;

    } catch (err: any) {

      setError(
        err?.response?.data?.message ||
        "Không thể tạo chi tiết phân công"
      );

      throw err;

    } finally {

      setLoading(false);

    }
  };

  return {
    createChiTietPhanCong,
    loading,
    error,
  };
};

