import type { MediaResponse } from "./Media";

export interface CreateSucoRequest {
  noiDung: string;
  diaDiem: string;
  kinhDo: number;
  viDo: number;
  mediaUrls?: string[];
}

export enum TrangThaiSuCo {
  CHO_TIEP_NHAN = "CHO_TIEP_NHAN",
  DANG_XU_LY = "DANG_XU_LY",
  DA_HOAN_THANH = "DA_HOAN_THANH",
  DA_TIEP_NHAN = "DA_TIEP_NHAN",
  LA_SPAM = "LA_SPAM",
}
export interface LoaiSuCo {
  maLoai: string;
  tenLoai: string;
}

export interface SucoResponse {
  maSuCo: string;
  diemSpam: number;
  lyDoSpam: string;
  tieuDe: string;
  maNguoiDan: string;
  kinhDo: number;
  viDo: number;
  diaDiem: string;
  noiDung: string;
  trangThai: string;
  ngayDuKienHoanThanh: string; // LocalDate -> string (ISO date)
  thoiGianTao: string; // LocalDateTime -> string (ISO datetime)
  medias: MediaResponse[];
}

export interface SucoSumaryResponse {
  maSuCo: string;
  diemSpam: number;
  lyDoSpam: string;
  tieuDe: string;
  maNguoiDan: string;
  kinhDo: number;
  viDo: number;
  diaDiem: string;
  noiDung: string;
  trangThai: string;
  loaiSuCos: string[];
  ngayDuKienHoanThanh: string;
  thoiGianTao: string;
  thumbnail: string;
}

export interface SucoDetailResponse {
  maSuCo: string;
  diemSpam: number;
  lyDoSpam: string;
  tieuDe: string;
  maNguoiDan: string;
  kinhDo: number;
  viDo: number;
  diaDiem: string;
  noiDung: string;
  trangThai: string;
  thoiGianTao: string;
  ngayDuKienHoanThanh: string;
  medias: MediaResponse[];
  loaiSuCos: string[];
}



