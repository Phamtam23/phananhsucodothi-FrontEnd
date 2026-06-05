import { DoUuTien } from './../types/Suco';
export const getLableTrangThaiSuco = (trangThai: string) => {
    switch (trangThai) {
      case "CHO_TIEP_NHAN":
        return "ĐANG CHỜ DUYỆT";
      case "DA_TIEP_NHAN":
        return "ĐÃ TIẾP NHẬN";
      case "TU_CHOI":
        return "ĐÃ TỪ CHỐI";
      case "BO_SUNG":
        return "CẦN BỔ SUNG";
      case "DANG_XU_LY":
        return "ĐANG XỬ LÝ";
      case "DA_XU_LY_XONG":
        return "ĐÃ HOÀN THÀNH";
      case "DA_DONG":
        return "ĐÃ ĐÓNG";
      default:
        return trangThai;
    }
  };

  export const getColorTrangThaiSuco = (trangThai: string) => {
  switch (trangThai) {
    case "CHO_TIEP_NHAN":
    case "DA_TIEP_NHAN":
    case "BO_SUNG":
    case "TU_CHOI":
      return "status--received";  
    case "DANG_XU_LY":
      return "status--processing"; 
    case "DA_XU_LY_XONG":
    case "DA_DONG":
      return "status--done";       
    default:
      return "status--default";
  }
};


export const getLabelTrangThaiKetQua = (trangThai: string) => {
    switch (trangThai) {
      case "CHO_DUYET": 
        return "ĐANG CHỜ DUYỆT";
      case "DA_DUYET": 
        return "ĐÃ DUYỆT";
      case "TU_CHOI": 
        return "ĐÃ TỪ CHỐI";
      default:
        return trangThai;
    }
  }

export const getColorTrangThaiKetQua = (trangThai: string) => {
    switch (trangThai) {
      case "CHO_DUYET":
        return "kq-badge--cho";
      case "DA_DUYET":
        return "kq-badge--duyet";
      case "TU_CHOI":
        return "kq-badge--tu";
      default:
        return "kq-badge--default";
    }
}


export const getLabelDoUuTien = (doUuTien:string) =>
{
  switch(doUuTien)
    {
      case "TRUNG_BINH" :
         return "Trung bình";
      case "KHAN_CAP" :
          return "Khẩn cấp";
      case "CAO" : 
          return "Cao";
      case "THAP" :
        return "Thấp"
      default:
        return doUuTien;
    }
}