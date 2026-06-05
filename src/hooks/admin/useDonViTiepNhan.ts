import { useState, useCallback } from "react";
import {
  GetAllDonViXuLyService,
  CreateDonViXuLyService,
  UpdateDonViXuLyService,
  DeleteDonViXuLyService,
} from "../../services/DonViXuLy";
import type { DonViXuLyResponse, CreateDonViXuLyRequest, UpdateDonViXuLyRequest } from "../../types/DonViXuLy";

export const useDonViTiepNhan = () => {
  const [danhSach, setDanhSach] = useState<DonViXuLyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layDanhSach = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetAllDonViXuLyService();
      if (res.status === 200) setDanhSach(res.data);
    } catch (err: any) {
      setError(err.message || "Lỗi lấy danh sách đơn vị");
    } finally {
      setLoading(false);
    }
  }, []);

  const themDonVi = async (request: CreateDonViXuLyRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CreateDonViXuLyService(request);
      if (res.status === 200 || res.status === 201) {
        await layDanhSach();
        return res.data;
      }
      throw new Error(res.message || "Lỗi thêm đơn vị");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi thêm đơn vị";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const capNhatDonVi = async (id: string, request: UpdateDonViXuLyRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UpdateDonViXuLyService(id, request);
      if (res.status === 200) {
        setDanhSach(prev => prev.map(dv => dv.maDonViXuLy === id ? res.data : dv));
        return res.data;
      }
      throw new Error(res.message || "Lỗi cập nhật đơn vị");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi cập nhật đơn vị";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const xoaDonVi = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await DeleteDonViXuLyService(id);
      if (res.status === 200 || res.status === 204) {
        await layDanhSach();
        return;
      }
      throw new Error(res.message || "Lỗi xóa đơn vị");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi xóa đơn vị";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { danhSach, loading, error, layDanhSach, themDonVi, capNhatDonVi, xoaDonVi };
};
