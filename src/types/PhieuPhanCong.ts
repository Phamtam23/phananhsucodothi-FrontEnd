import type { DonViXuLySCResponse } from "./DonViXuLy";
import type { KetQuaXuLyDetailResponse } from "./KetQuaXuLy";

export interface CreatePhieuPhanCongRequest {
  maSuCo: string;
  maDonViXuLy: string[];
  ghiChu?: string;
}

export enum TrangThaiPhanCong {
  CHO_TIEP_NHAN = "CHO_TIEP_NHAN",
  DA_TIEP_NHAN = "DA_TIEP_NHAN",
  TU_CHOI = "TU_CHOI",
  DANG_XU_LY = "DANG_XU_LY",
  HOAN_THANH = "HOAN_THANH",
}

export interface UpdatePhieuPhanCongRequest {
  trangThai: TrangThaiPhanCong;
  ghiChu?: string;
  lyDoTuChoi?: string;
}
export interface PhieuPhanCongResponse {
  maPhieuPhanCong: string;

  maSuCo: string;

  maDonViXuLy: string;

  maNhanVienDieuPhoi: string;

  trangThai: TrangThaiPhanCong;

  ghiChu: string;

  lyDoTuChoi: string;

  thoiGianTao: string;
}

export interface PhieuTrangThaiResponse {
  
  canDanhGia: boolean;

  daDanhGia: boolean;

  canMoLai: boolean;

  daMoLai: boolean;
}
export interface PhieuPhanCongSCResponse {
  maPhieuPhanCong: string;

  donViXuLy: DonViXuLySCResponse;

  maNhanVienDieuPhoi: string;

  trangThai: TrangThaiPhanCong;

  thoiGianTao: string; 

  maSuCo: string;

  phieuTrangThaiResponse: PhieuTrangThaiResponse;

  ketQuaXuLyDetailResponse: KetQuaXuLyDetailResponse;
}



