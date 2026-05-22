import type { NhanVienDonViResponse } from "./NhanVienDonVi";
import type { PhieuPhanCongResponse } from "./PhieuPhanCong";
export enum TrangThaiChiTietPhanCong {
  DANG_CHO = "DANG_CHO",
  DANG_XU_LY = "DANG_XU_LY",
  CHO_DUYET = "CHO_DUYET",
  HOAN_THANH = "HOAN_THANH",
  TU_CHOI = "TU_CHOI",
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