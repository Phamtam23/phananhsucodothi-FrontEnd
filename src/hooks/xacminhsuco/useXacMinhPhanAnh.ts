import { useState } from "react";
import { usePhieuPhanCongDonVi } from "../phancong/usePhieuPhanCongDonVi"
import { useUpdatePhieuPhanCong } from "../phancong/useUpdatePhieuPhanCong";
import { usePhieuMoLaiDonVi } from "../phieumolai/usePhieuMoLaiDonVi";
import { useDuyetPhieuMoLai } from "../phieumolai/useDuyetPhieuMoLai";
import { TrangThaiPhanCong } from "../../types/PhieuPhanCong";
import { TrangThaiMoLai } from "../../types/PhieuMoLai";

export const useXacMinhPhanAnh = () => {
    const { data, loading, error, refetch } = usePhieuPhanCongDonVi(0, 100);
    const { updatePhieuPhanCong,loading: dangCapNhat } = useUpdatePhieuPhanCong();
    const { data: duLieuMoLai,loading: dangTaiMoLai, refetch: taiLaiMoLai  } = usePhieuMoLaiDonVi(0, 100);
    const { duyetPhieuMoLai, loading: dangDuyet  } = useDuyetPhieuMoLai();

   const [lyDoTuChoi, setLyDoTuChoi] = useState<string>("");
   const [idDangTuChoi, setIdDangTuChoi] = useState<string | null>(null);
   const [idXemKetQua, setIdXemKetQua] = useState<string>("");

   const [idMoLaiTuChoi, setIdMoLaiTuChoi] = useState<string>("");
   const [lyDoTuChoiMoLai, setLyDoTuChoiMoLai] = useState<string>("");

    const [tabChinh, setTabChinh] = useState<"PHAN_CONG"|"MO_LAI">("PHAN_CONG");
    const [tabPhanCong, setTabPhanCong] = useState<"CHO_XAC_NHAN" | "DA_XAC_NHAN" | "DANG_XU_LY" | "CHO_DUYET_KET_QUA" | "HOAN_THANH">("CHO_XAC_NHAN");
    const [tabMoLai, setTabMoLai] = useState<"CHO_PHAN_HOI" | "DA_XU_LY">("CHO_PHAN_HOI");

    const danhSachPhieuPhanCong = data?.content || [];
    const danhSachPhieuMoLai = duLieuMoLai?.content || [];

    const soChoXacNhan = danhSachPhieuPhanCong.filter(i => i.trangThai === TrangThaiPhanCong.CHO_XAC_NHAN).length;
    const soDaXacNhan = danhSachPhieuPhanCong.filter(i => i.trangThai === TrangThaiPhanCong.DA_XAC_NHAN).length;

    const soMoLai = danhSachPhieuMoLai.filter(p => p.trangThaiMoLai === TrangThaiMoLai.CHO_PHAN_HOI).length;

    const danhSachHienThi = danhSachPhieuPhanCong.filter(i => i.trangThai === tabPhanCong);
    const danhSachMoLaiHienThi = danhSachPhieuMoLai.filter(p => {
        if (tabMoLai === TrangThaiMoLai.CHO_PHAN_HOI) return p.trangThaiMoLai === TrangThaiMoLai.CHO_PHAN_HOI;
        return p.trangThaiMoLai === TrangThaiMoLai.CHAP_NHAN || p.trangThaiMoLai === TrangThaiMoLai.TU_CHOI;
    });

    const chapNhanPhieuPhanCong = async (maPhieuPhanCong: string) => {
        await updatePhieuPhanCong(maPhieuPhanCong, {
            trangThai: TrangThaiPhanCong.DA_XAC_NHAN
        });
        await refetch();
    }

    const tuChoiPhieuPhanCong = async (maPhieuPhanCong: string, lyDoTuChoi: string) => {
        await updatePhieuPhanCong(maPhieuPhanCong, {
            trangThai: TrangThaiPhanCong.TU_CHOI,
            lyDoTuChoi
        });
        await refetch();
    }

    const duyetPhieuMoLaiHanPhanAnh = async (maPhieuMoLai: string, chapNhan: boolean, lyDoTuChoi?: string) => {
        if (!chapNhan && !lyDoTuChoiMoLai.trim()) { alert("Vui lòng nhập lý do từ chối"); return; }
        if (chapNhan && !window.confirm("Chấp nhận yêu cầu này sẽ yêu cầu nhân viên làm lại kết quả. Bạn có chắc chắn?")) return;
        try {
        await duyetPhieuMoLai(maPhieuMoLai, chapNhan, lyDoTuChoi);
        alert(chapNhan ? "Đã duyệt yêu cầu mở lại!" : "Đã từ chối yêu cầu mở lại!");
        setIdMoLaiTuChoi("");
        setLyDoTuChoiMoLai("");
        await taiLaiMoLai();
        refetch();
        } catch (e: any) {
            alert(e.message || "Có lỗi xảy ra");
        }
    }

return {
     loading, error, dangTaiMoLai, dangCapNhat, dangDuyet,
       
        tabChinh, setTabChinh,
        tabPhanCong, setTabPhanCong,
        tabMoLai, setTabMoLai,
      
        soChoXacNhan, soDaXacNhan, soMoLai,
    
        danhSachHienThi, danhSachMoLaiHienThi,

        idDangTuChoi, setIdDangTuChoi,
        lyDoTuChoi, setLyDoTuChoi,
  
        idXemKetQua, setIdXemKetQua,

        idMoLaiTuChoi , setIdMoLaiTuChoi,
        lyDoTuChoiMoLai, setLyDoTuChoiMoLai,
    
        chapNhanPhieuPhanCong, tuChoiPhieuPhanCong, duyetPhieuMoLaiHanPhanAnh,


}   

}