import type { MediaResponse } from "./Media";

export interface CreateSucoRequest {
  noiDung: string;
  diaDiem: string;
  kinhDo: number;
  viDo: number;
  mediaUrls?: string[];
}

export interface UpdateSucoRequest {
  maSuCo: string;
  noiDung: string;
  mediaUrls?: string[];
}

export enum TrangThaiSuCo {
  CHO_TIEP_NHAN = "CHO_TIEP_NHAN",
  DANG_XU_LY = "DANG_XU_LY",
  DA_XU_LY_XONG = "DA_XU_LY_XONG",
  DA_TIEP_NHAN = "DA_TIEP_NHAN",
  TU_CHOI = "TU_CHOI",
  BO_SUNG = "BO_SUNG",
  DA_DONG = "DA_DONG"
}

export enum DoUuTien {
  THAP = "THAP",
  TRUNG_BINH = "TRUNG_BINH",
  CAO = "CAO",
  KHAN_CAP = "KHAN_CAP",
}

export interface LoaiSuCo {
  maLoai: string;
  tenLoai: string;
}

export interface SucoResponse {
  maSuCo: string;
  diemSpam: number;
  doUuTien: DoUuTien;
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
  doUuTien: DoUuTien;
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

export interface SuCoFilterRequest {
  keyword?: string;
  trangThai?: TrangThaiSuCo[];
  maLoai?: string;
  diaDiem?: string;
}

