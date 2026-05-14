export enum MucDoDanhGia {
  HAI_LONG = "HAI_LONG",
  CHAP_NHAN = "CHAP_NHAN",
  KHONG_HAI_LONG = "KHONG_HAI_LONG",
}

export interface PhieuDanhGiaRequest {
    maKetQuaXuLy: string;
    mucDoHaiLong: MucDoDanhGia;
}

export interface PhieuDanhGiaResponse {
  maXuLyKetQua: string;
  mucDoDanhGia: MucDoDanhGia;
}