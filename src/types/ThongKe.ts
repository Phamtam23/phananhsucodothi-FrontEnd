export interface ThongKeHeThongResponse {
  tongSoSuCo: number;
  suCoChuaXuLy: number;
  suCoDangXuLy: number;
  suCoDaXuLy: number;
  tongSoTaiKhoan: number;
  tongSoDonVi: number;
  tongSoLoai: number;
  suCoTheoLoai: ThongKeLoaiItem[];
  suCoTheoTrang: ThongKeTrangThaiItem[];
  suCoTheoThang: ThongKeThangItem[];
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
