import { useState, useCallback } from "react";
import {
  GetAllTaiKhoanService,
  CreateTaiKhoanService,
  UpdateTaiKhoanService,
  KhoaTaiKhoanService,
  MoKhoaTaiKhoanService,
} from "../../services/TaiKhoanService";
import type { TaiKhoanResponse, CreateTaiKhoanRequest, UpdateTaiKhoanRequest } from "../../types/TaiKhoan";

export const useTaiKhoan = () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layDanhSach = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetAllTaiKhoanService();
      if (res.status === 200) setDanhSach(res.data);
    } catch (err: any) {
      setError(err.message || "Lỗi lấy danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  }, []);

  const taoTaiKhoan = async (request: CreateTaiKhoanRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CreateTaiKhoanService(request);
      if (res.status === 200 || res.status === 201) {
        await layDanhSach();
        return res.data;
      }
      throw new Error(res.message || "Lỗi tạo tài khoản");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi tạo tài khoản";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const capNhatTaiKhoan = async (id: string, request: UpdateTaiKhoanRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UpdateTaiKhoanService(id, request);
      if (res.status === 200) {
        setDanhSach(prev => prev.map(tk => tk.maTaiKhoan === id ? res.data : tk));
        return res.data;
      }
      throw new Error(res.message || "Lỗi cập nhật tài khoản");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi cập nhật tài khoản";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const khoaTaiKhoan = async (id: string) => {
    setLoading(true);
    try {
      const res = await KhoaTaiKhoanService(id);
      if (res.status === 200) {
        setDanhSach(prev => prev.map(tk => tk.maTaiKhoan === id ? res.data : tk));
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khóa tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const moKhoaTaiKhoan = async (id: string) => {
    setLoading(true);
    try {
      const res = await MoKhoaTaiKhoanService(id);
      if (res.status === 200) {
        setDanhSach(prev => prev.map(tk => tk.maTaiKhoan === id ? res.data : tk));
      }
    } catch (err: any) {
      setError(err.message || "Lỗi mở khóa tài khoản");
    } finally {
      setLoading(false);
    }
  };

  return { danhSach, loading, error, layDanhSach, taoTaiKhoan, capNhatTaiKhoan, khoaTaiKhoan, moKhoaTaiKhoan };
};
