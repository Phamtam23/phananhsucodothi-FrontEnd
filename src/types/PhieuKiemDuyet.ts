export enum TrangThaiKiemDuyet {
  CHO_KIEM_DUYET = "CHO_KIEM_DUYET",
  DUYET = "DUYET",
  TU_CHOI = "TU_CHOI",
  BO_SUNG = "BO_SUNG",
}

export interface CreatePhieuKiemDuyetRequest {
  trangThaiKiemDuyet: TrangThaiKiemDuyet;
  maSuCo: string;
  lyDoTuChoi: string;
}

export interface PhieuKiemDuyetResponse {
  maKiemDuyet: string;
  maNhanVienDieuPhoi: string;
  maSuCo: string;
  trangThai: TrangThaiKiemDuyet;
  lyDoTuChoi: string;
  thoiGianTao: string; 
  tieuDe: string;
  diaDiem: string;
  thumbnail: string;
}