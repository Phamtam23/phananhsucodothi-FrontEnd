export interface CreateChiDaoRequest {
  maChiTietPhanCong: string;
  maTruongDonVi: string;
  noiDung: string;
  ngayChiDao: string;
}

export interface UpdateChiDaoRequest {
  noiDung: string;
}

export interface PhieuChiDaoResponse {
  maChiDao: string;

  maChiTietPhanCong: string;

  maTruongDonVi: string;

  noiDung: string;

  ngayChiDao: string;
}