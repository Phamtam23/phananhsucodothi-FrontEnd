export enum TrangThaiMoLai {
  CHO_XU_LY = "CHO_XU_LY",
  DA_XU_LY = "DA_XU_LY",
  TU_CHOI = "TU_CHOI",
}

export interface CreatePhieuMoLaiRequest {
  maKetQuaXuLy: string;
  lyDo: string;
  mediaUrls: string[];
}

export interface UpdatePhieuMoLai {
  maPhieuMoLai: string;
  trangThaiMoLai: TrangThaiMoLai;
}

export interface PhieuMoLaiResponse {
  maPhieuMoLai: string;
  lyDo: string;
  trangThaiMoLai: TrangThaiMoLai;
  maKetQuaXuLy: string;
}