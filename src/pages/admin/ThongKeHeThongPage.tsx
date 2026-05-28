import { useEffect, useState } from "react";
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
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const [thang, setThang] = useState<number | "">("");

  useEffect(() => { 
    layThongKe(nam, thang === "" ? undefined : thang); 
  }, [layThongKe, nam, thang]);

  if (loading && !thongKe) return <div className="thong-ke-he-thong__loading">Đang tải thống kê...</div>;

  // Khi chưa có dữ liệu thì dùng giá trị mặc định 0
  const dk = thongKe ?? {
    tongSoSuCo: 0, tongSuCoTrongNam: 0, tongSuCoTrongThang: 0,
    suCoChuaXuLy: 0, suCoDangXuLy: 0, suCoDaXuLy: 0,
    tongSoTaiKhoan: 0, tongSoDonVi: 0, tongSoLoai: 0,
    suCoTheoLoai: [], suCoTheoTrang: [], suCoTheoThang: [],
    bieuDoDonVi: [], bangThongKeDonVi: []
  };

  const maxLoai = dk.suCoTheoLoai?.reduce((m: number, x: any) => Math.max(m, x.soLuong), 1) || 1;
  const maxDonVi = dk.bieuDoDonVi?.reduce((m: number, x: any) => Math.max(m, x.soLuong), 1) || 1;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="thong-ke-he-thong">
      <div className="thong-ke-he-thong__tieu-de-container">
        <div className="thong-ke-he-thong__tieu-de">
          <h1>Thống kê hệ thống</h1>
          <p>Tổng quan hoạt động toàn hệ thống</p>
        </div>
        <div className="thong-ke-he-thong__filters">
          <select 
            value={nam} 
            onChange={(e) => setNam(Number(e.target.value))}
            className="thong-ke-he-thong__select"
          >
            {years.map(y => (
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
          <select 
            value={thang} 
            onChange={(e) => setThang(e.target.value ? Number(e.target.value) : "")}
            className="thong-ke-he-thong__select"
          >
            <option value="">Cả năm</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="thong-ke-he-thong__overview-cards">
        <div className="stat-card primary-border">
          <div className="stat-title">Sự cố trong năm {nam}</div>
          <div className="stat-value-container">
            <h3 className="stat-value">{dk.tongSuCoTrongNam}</h3>
          </div>
        </div>
        {thang !== "" && (
          <div className="stat-card">
            <div className="stat-title">Sự cố trong tháng {thang}/{nam}</div>
            <div className="stat-value-container">
              <h3 className="stat-value">{dk.tongSuCoTrongThang}</h3>
            </div>
          </div>
        )}
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

      {/* Biểu đồ đơn vị */}
      {dk.bieuDoDonVi && dk.bieuDoDonVi.length > 0 && (
        <div className="chart-section">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Số lượng sự cố theo đơn vị xử lý</h3>
              <p>Thống kê số lượng sự cố phân công cho từng đơn vị {thang ? `trong tháng ${thang}/${nam}` : `trong năm ${nam}`}</p>
            </div>
          </div>
          <div className="chart-area" style={{ overflowX: 'auto', paddingBottom: '40px' }}>
            {dk.bieuDoDonVi.map((item: any, idx: number) => (
              <div className="chart-bar-group" key={idx} style={{ minWidth: '60px', marginRight: '20px' }}>
                <div 
                  className="bar" 
                  style={{ height: `${(item.soLuong / maxDonVi) * 100}%`, minHeight: '4px' }} 
                  title={`${item.tenDonVi}: ${item.soLuong}`}
                />
                <span className="label" style={{ fontSize: '10px', whiteSpace: 'nowrap', transform: 'rotate(-45deg)', bottom: '-35px' }}>
                  {item.tenDonVi.length > 15 ? item.tenDonVi.substring(0, 15) + '...' : item.tenDonVi}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="thong-ke-he-thong__bottom-grid">
        {/* Thống kê theo loại */}
        {dk.suCoTheoLoai && dk.suCoTheoLoai.length > 0 && (
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

        {/* Bảng đơn vị */}
        {dk.bangThongKeDonVi && dk.bangThongKeDonVi.length > 0 && (
          <div className="team-section" style={{ gridColumn: 'span 2' }}>
            <div className="team-header">
              <h3>Hiệu suất các đơn vị xử lý</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Đơn vị</th>
                    <th>Tổng sự cố</th>
                    <th>Đang xử lý</th>
                    <th>Hoàn thành</th>
                    <th>Tỉ lệ hoàn thành</th>
                    <th>Đánh giá tốt</th>
                    <th>Tỉ lệ mở lại</th>
                  </tr>
                </thead>
                <tbody>
                  {dk.bangThongKeDonVi.map((dv: any, idx: number) => (
                    <tr key={idx}>
                      <td>
                        <div className="employee-info">
                          <div className="details">
                            <h4 className="name">{dv.tenDonVi}</h4>
                          </div>
                        </div>
                      </td>
                      <td><span className="total-handled">{dv.tongSuCo}</span></td>
                      <td>
                        <span className="status-badge active">{dv.dangXuLy}</span>
                      </td>
                      <td>
                        <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>{dv.hoanThanh}</span>
                      </td>
                      <td>
                        <div className="completion-rate">
                          <div className="progress-bar">
                            <div className="fill" style={{ width: `${dv.tiLeHoanThanh}%` }} />
                          </div>
                          <span className="percentage">{dv.tiLeHoanThanh}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="completion-rate">
                          <span className="percentage" style={{ color: '#15803d' }}>{dv.tiLeDanhGiaTot}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="completion-rate">
                          <span className="percentage" style={{ color: '#b91c1c' }}>{dv.tiLeMoLai}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongKeHeThongPage;
