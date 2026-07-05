import type { LoaiResponse } from "./Loai";

export interface PhieuPhanLoaiRequest {
  maSuCo: string;

  maLoai: string[];
}

export interface PhieuPhanLoaiResponse {

  maSuCo: string;

  dsLoai: LoaiResponse[];

  thoiGianPhanLoai: string;
}