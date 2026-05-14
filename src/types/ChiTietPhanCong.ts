export type TrangThaiChiTietPhanCong =
  | "HOANTHANH"
  | "DANGCHO";

export interface CreateChiTietPhanCongRequest {
  maPhieuPhanCong: string;

  maNhanVienXuLy: string;

  trangThai: TrangThaiChiTietPhanCong;

  thoiGianTao: string; 
}

export interface UpdateChiTietPhanCongRequest {
  maChiTietPhanCong: string;

  trangThai: TrangThaiChiTietPhanCong;
}

// export interface ChiTietPhanCongResponse {
//   maChiTietPhanCong: string;

//   phieuPhanCong: PhieuPhanCongSCResponse;

//   nhanVienXuLy: NhanVienDonViResponse;

//   trangThai: TrangThaiChiTietPhanCong;

//   thoiGianTao: string; // LocalDateTime
// }