export interface ThongKeHeThongResponse {
  tongSoSuCo: number;
  tongSuCoTrongNam: number;
  tongSuCoTrongThang: number;
  suCoChuaXuLy: number;
  suCoDangXuLy: number;
  suCoDaXuLy: number;
  tongSoTaiKhoan: number;
  tongSoDonVi: number;
  tongSoLoai: number;
  suCoTheoLoai: ThongKeLoaiItem[];
  suCoTheoTrang: ThongKeTrangThaiItem[];
  suCoTheoThang: ThongKeThangItem[];
  bieuDoDonVi: BieuDoDonViItem[];
  bangThongKeDonVi: BangThongKeDonViItem[];
}

export interface BieuDoDonViItem {
  tenDonVi: string;
  soLuong: number;
}

export interface BangThongKeDonViItem {
  tenDonVi: string;
  tongSuCo: number;
  dangXuLy: number;
  hoanThanh: number;
  tiLeHoanThanh: number;
  tiLeDanhGiaTot: number;
  tiLeMoLai: number;
}

export interface ThongKeLoaiItem {
  tenLoai: string;
  soLuong: number;
}

export interface ThongKeTrangThaiItem {
  trangThai: string;
  soLuong: number;
}

export interface ThongKeThangItem {
  thang: string;
  soLuong: number;
}


export interface ThongKeNhanVienItem {
    tenNhanVien: string;
    soLuong: number;
}

export interface ThongKeDonViResponse {
    tongSuCoTatCa: number;
    tongSuCoTrongNam: number;
    suCoTheoThang: ThongKeThangItem[];
    suCoNhanVien: ThongKeNhanVienItem[];
}