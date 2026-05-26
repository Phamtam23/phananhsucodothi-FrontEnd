export interface requestLogin {
    email: string;
    matKhau: string;
}

export interface RegisterRequest {
  email: string;
  matKhau: string;
  nhapLaiMatKhau: string;
  hoTen: string;
  soDienThoai: string;
  cccd: string;
  diaChi?: string;
}

export interface AuthResponse {
  accessToken: string;
  maTaiKhoan: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  cccd: string;
  diaChi?: string;
  anhDaiDien?: string;
}

export interface ProfileResponse {
  maTaiKhoan: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  cccd: string;
  diaChi?: string;
  anhDaiDien?: string;
  ngayBatDau: string;
  chucVu: string;
}

export interface UpdateProfileRequest {
  hoTen?: string;
  soDienThoai?: string;
  diaChi?: string;
  email?:string;
  anhDaiDien?: string;
}