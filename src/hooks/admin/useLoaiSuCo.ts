import { useState, useCallback } from "react";
import {
  GetAllLoaiService,
  CreateLoaiService,
  UpdateLoaiService,
  DeleteLoaiService,
} from "../../services/LoaiService";
import type { LoaiResponse, LoaiRequest } from "../../types/Loai";

export const useLoaiSuCo = () => {
  const [danhSach, setDanhSach] = useState<LoaiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layDanhSach = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetAllLoaiService();
      if (res.status === 200) setDanhSach(res.data);
    } catch (err: any) {
      setError(err.message || "Lỗi lấy danh sách loại sự cố");
    } finally {
      setLoading(false);
    }
  }, []);

  const themLoai = async (request: LoaiRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CreateLoaiService(request);
      if (res.status === 200 || res.status === 201) {
        await layDanhSach();
        return res.data;
      }
      throw new Error(res.message || "Lỗi thêm loại sự cố");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi thêm loại sự cố";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const capNhatLoai = async (request: LoaiRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UpdateLoaiService(request);
      if (res.status === 200) {
        setDanhSach(prev => prev.map(l => l.maLoai === request.maLoai ? res.data : l));
        return res.data;
      }
      throw new Error(res.message || "Lỗi cập nhật loại sự cố");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi cập nhật loại sự cố";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const xoaLoai = async (maLoai: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await DeleteLoaiService(maLoai);
      if (res.status === 200 || res.status === 204) {
        await layDanhSach();
        return;
      }
      throw new Error(res.message || "Lỗi xóa loại sự cố");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi xóa loại sự cố";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { danhSach, loading, error, layDanhSach, themLoai, capNhatLoai, xoaLoai };
};
