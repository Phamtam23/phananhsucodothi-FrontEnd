import { useEffect } from "react";
import { BarChart3, Users, Building2, Tag, AlertTriangle, Loader, CheckCircle } from "lucide-react";
import { useThongKe } from "../../hooks/admin/useThongKe";
import "./ThongKeHeThongPage.scss";

const THE_SO_DATA = (thongKe: any) => [
  { icon: <AlertTriangle size={22} />, so: thongKe.tongSoSuCo, nhan: "Tổng sự cố", mau: "#eff6ff", mauIcon: "#2563eb" },
  { icon: <Loader size={22} />, so: thongKe.suCoChuaXuLy, nhan: "Chưa xử lý", mau: "#fef9c3", mauIcon: "#ca8a04" },
  { icon: <BarChart3 size={22} />, so: thongKe.suCoDangXuLy, nhan: "Đang xử lý", mau: "#ede9fe", mauIcon: "#7c3aed" },
  { icon: <CheckCircle size={22} />, so: thongKe.suCoDaXuLy, nhan: "Đã xử lý", mau: "#dcfce7", mauIcon: "#15803d" },
  { icon: <Users size={22} />, so: thongKe.tongSoTaiKhoan, nhan: "Tài khoản", mau: "#fce7f3", mauIcon: "#be185d" },
  { icon: <Building2 size={22} />, so: thongKe.tongSoDonVi, nhan: "Đơn vị", mau: "#e0f2fe", mauIcon: "#0369a1" },
  { icon: <Tag size={22} />, so: thongKe.tongSoLoai, nhan: "Loại sự cố", mau: "#ffedd5", mauIcon: "#c2410c" },
];

const ThongKeHeThongPage = () => {
  const { thongKe, loading, layThongKe } = useThongKe();

  useEffect(() => { layThongKe(); }, [layThongKe]);

  if (loading) return <div className="thong-ke-he-thong__loading">Đang tải thống kê...</div>;

  // Khi chưa có dữ liệu thì dùng giá trị mặc định 0
  const dk = thongKe ?? {
    tongSoSuCo: 0, suCoChuaXuLy: 0, suCoDangXuLy: 0, suCoDaXuLy: 0,
    tongSoTaiKhoan: 0, tongSoDonVi: 0, tongSoLoai: 0,
    suCoTheoLoai: [], suCoTheoTrang: [], suCoTheoThang: [],
  };

  const maxLoai = dk.suCoTheoLoai.reduce((m: number, x: any) => Math.max(m, x.soLuong), 1);

  return (
    <div className="thong-ke-he-thong">
      <div className="thong-ke-he-thong__tieu-de">
        <h1>Thống kê hệ thống</h1>
        <p>Tổng quan hoạt động toàn hệ thống</p>
      </div>

      {/* Thẻ số liệu */}
      <div className="thong-ke-he-thong__so-lieu">
        {THE_SO_DATA(dk).map((item, idx) => (
          <div className="thong-ke-he-thong__the-so" key={idx}>
            <div className="thong-ke-he-thong__the-so-icon" style={{ background: item.mau, color: item.mauIcon }}>
              {item.icon}
            </div>
            <div className="thong-ke-he-thong__the-so-so">{item.so ?? 0}</div>
            <div className="thong-ke-he-thong__the-so-nhan">{item.nhan}</div>
          </div>
        ))}
      </div>

      {/* Thống kê theo loại */}
      {dk.suCoTheoLoai.length > 0 && (
        <div className="thong-ke-he-thong__bang-loai">
          <h2>Sự cố theo loại</h2>
          {dk.suCoTheoLoai.map((item: any, idx: number) => (
            <div className="thong-ke-he-thong__hang-loai" key={idx}>
              <span className="thong-ke-he-thong__ten-loai">{item.tenLoai}</span>
              <div className="thong-ke-he-thong__thanh-tien-trinh">
                <div
                  className="thong-ke-he-thong__thanh-tien-trinh-noi"
                  style={{ width: `${(item.soLuong / maxLoai) * 100}%` }}
                />
              </div>
              <span className="thong-ke-he-thong__so-loai">{item.soLuong}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThongKeHeThongPage;
