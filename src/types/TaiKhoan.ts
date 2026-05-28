export interface TaiKhoanResponse {
  maTaiKhoan: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  cccd: string;
  diaChi?: string;
  vaiTro: string;
  trangThai: string;
  anhDaiDien?: string;
}

export interface CreateTaiKhoanRequest {
  email: string;
  matKhau: string;
  hoTen: string;
  soDienThoai: string;
  cccd: string;
  diaChi?: string;
  vaiTro: string;
  maDonVi?: string;
}

export interface UpdateTaiKhoanRequest {
  hoTen?: string;
  soDienThoai?: string;
  diaChi?: string;
  vaiTro?: string;
  trangThai?: string;
}

export enum VaiTro {
  ADMIN = 'ADMIN',
  NHAN_VIEN_DIEU_PHOI = 'NHAN_VIEN_DIEU_PHOI',
  TRUONG_DON_VI = 'TRUONG_DON_VI',
  NHAN_VIEN_XU_LY = 'NHAN_VIEN_XU_LY',
  NGUOI_DAN = 'NGUOI_DAN',
}

export enum TrangThaiTaiKhoan {
  HOAT_DONG = 'HOAT_DONG',
  BI_KHOA = 'BI_KHOA',
}
