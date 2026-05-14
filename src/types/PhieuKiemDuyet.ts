export enum TrangThaiKiemDuyet {
  CHO_KIEM_DUYET = "CHO_KIEM_DUYET",
  DA_DUYET = "DA_DUYET",
  TU_CHOI = "TU_CHOI",
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
}