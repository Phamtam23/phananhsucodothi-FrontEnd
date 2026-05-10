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
