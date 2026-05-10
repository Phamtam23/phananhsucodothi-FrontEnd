import type { MediaResponse } from "./Media";

export interface CreateSucoRequest {
    noiDung: string;
    diaDiem: string;
    kinhDo: number; 
    viDo: number;
    mediaUrls?: string[]; 
}

export const TrangThaiSuCo = {
  CHO_TIEP_NHAN : "CHO_TIEP_NHAN",
  DA_TIEP_NHAN : "DA_TIEP_NHAN",
  DANG_XU_LY : "DANG_XU_LY",
  DA_XU_LY_XONG : "DA_XU_LY_XONG",
  DA_DONG : "DA_DONG",
  TU_CHOI : "TU_CHOI",
} as const;

export interface SucoResponse {
  maSuCo: string;
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

