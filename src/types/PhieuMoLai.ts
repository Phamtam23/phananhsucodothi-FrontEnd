export enum TrangThaiMoLai {
  CHO_PHAN_HOI = "CHO_PHAN_HOI",
  CHAP_NHAN = "CHAP_NHAN",
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
  MediaUrls: string[];
  thoiGianTao: string;
  lyDoTuChoi?: string;
  maSuCo: string;
  noiDungSuCo?: string;
  maPhieuPhanCong: string;
}