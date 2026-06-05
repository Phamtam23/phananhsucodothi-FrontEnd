import { GetPhieuChiDaoByPhanCongIdService } from "../../services/PhieuChiDaoService";
import { useState, useEffect } from "react";
import type { PhieuChiDaoResponse } from "../../types/PhieuChiDao";
import "./DanhSachChiDao.scss";
const DanhSachChiDao = ({ chiTietPhanCong, nhanVien }: { chiTietPhanCong: string | number, nhanVien?: any }) => {
  const [chiDaoData, setChiDaoData] = useState<PhieuChiDaoResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChiDao = async (chiTietPhanCong: number | string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetPhieuChiDaoByPhanCongIdService(chiTietPhanCong);
      if (response.status === 200) {
        setChiDaoData(response.data);
      } else {
        setError("Không thể tải danh sách chỉ đạo.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách chỉ đạo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chiTietPhanCong) {
      fetchChiDao(chiTietPhanCong);
    }
  }, [chiTietPhanCong]);

  if (loading) {
    return <div className="timeline-item"><span className="timeline-loading">Đang tải danh sách chỉ đạo...</span></div>;
  }

  if (error) {
    return <div className="timeline-item"><span className="timeline-error">{error}</span></div>;
  }

  if (chiDaoData.length === 0) {
    return null;
  }

  return (
    <div className="timeline-item chi-dao-container">
      <div className="chi-dao-card">
        {nhanVien && (
          <div className="chi-dao-assignee-header">
            <div className="assignee-avatar">
              <img src={nhanVien.anhDaiDien || `https://ui-avatars.com/api/?name=${encodeURIComponent(nhanVien.hoTen)}&background=475569&color=fff`} alt={nhanVien.hoTen} />
            </div>
            <div className="assignee-info">
              <span className="assignee-name">{nhanVien.hoTen}</span>
              <span className="assignee-role">NHÂN SỰ CHÍNH</span>
            </div>
          </div>
        )}

        <div className="chi-dao-list">
          <span className="chi-dao-section-title">CHỈ ĐẠO / YÊU CẦU:</span>
          {chiDaoData.map((chiDao) => (
            <div className="chi-dao-row" key={chiDao.maChiDao}>
              <div className="chi-dao-bullet"></div>
              <p className="chi-dao-text">"{chiDao.noiDung}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DanhSachChiDao;