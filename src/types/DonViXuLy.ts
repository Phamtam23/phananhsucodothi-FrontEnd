export enum TrangThaiDonVi {
  HOAT_DONG = "HOAT_DONG",
  TAM_NGUNG = "TAM_NGUNG",
}

export interface DonViXuLySCResponse {
  maDonViXuLy: string;
  tenDonVi: string;
}

export interface DonViXuLyResponse {
  maDonViXuLy: string;
  tenDonVi: string;
  khuVuc: string;
  moTa: string;
  diaChi: string;
  sdt: string;
  email: string;
  trangThai: string;
}

export interface CreateDonViXuLyRequest {
  tenDonVi: string;
  khuVuc?: string;
  moTa?: string;
  diaChi?: string;
  sdt?: string;
  email?: string;
}

export interface UpdateDonViXuLyRequest {
  tenDonVi?: string;
  khuVuc?: string;
  moTa?: string;
  diaChi?: string;
  sdt?: string;
  email?: string;
  trangThai?: TrangThaiDonVi;
}
