import type { NhanVienDonViResponse } from "./NhanVienDonVi";
import type { PhieuPhanCongResponse } from "./PhieuPhanCong";
export enum TrangThaiChiTietPhanCong {
  HOANTHANH = "HOANTHANH",
  DANGCHO = "DANGCHO",
}

export interface CreateChiTietPhanCongRequest {
  maPhieuPhanCong: string;

  maNhanVienXuLy: string;
}

export interface UpdateChiTietPhanCongRequest {
  maChiTietPhanCong: string;

  trangThai: TrangThaiChiTietPhanCong;
}

export interface ChiTietPhanCongResponse {
  maChiTietPhanCong: string;

  phieuPhanCong: PhieuPhanCongResponse;

  nhanVienXuLy: NhanVienDonViResponse;

  trangThai: TrangThaiChiTietPhanCong;

  thoiGianTao: string; // LocalDateTime
}