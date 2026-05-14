import type { MediaResponse } from "./Media";
export interface KetQuaXuLyBaseResponse {
  maKetQuaXuLy: string;
  maChiTietPhanCong: string;
  thoiGianNop: string; 
  noiDungThucHien: string;
}

export interface KetQuaXuLyDetailResponse
  extends KetQuaXuLyBaseResponse {
  medias: MediaResponse[];
}

export interface KetQuaXuLySummaryResponse
  extends KetQuaXuLyBaseResponse {}

export interface CreateKetQuaXuLyRequest {
  maChiTietPhanCong: string;
  noiDungThucHien: string;
  mediaUrls: string[];
}

export enum TrangThaiKetQua {
  CHO_DUYET = "CHO_DUYET",
  DA_DUYET = "DA_DUYET",
  TU_CHOI = "TU_CHOI",
}

export interface UpdateKetQuaXuLyRequest {
  maKetQuaXuLy: string;
  noiDungThucHien: string;
  trangThaiKetQua: TrangThaiKetQua;
  mediaUrls: string[];
}

