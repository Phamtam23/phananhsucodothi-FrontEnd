import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin } from 'lucide-react';
import { useLocationSearch } from '../../../hooks/suco/uselocationsearch';
import IncidentMap from '../../../components/Map/IncidentMap';
import IncidentSidebarList from '../../../components/Map/IncidentSidebarList';
import {useBanDo} from '../../../hooks/nguodan/useBanDo';
import './BanDoPage.scss';

const BanDoPage = () => {
  const { danhSachSuCo, loading, error, fetchDanhSachSuCo, danhSachLoai } = useBanDo();

  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0544, 108.2022]); 
  const [mapZoom, setMapZoom] = useState(13);
  const [trangThaiFilter, setTrangThaiFilter] = useState<string>("tat_ca");
  const [loaiFilter, setLoaiFilter] = useState<string>("tat_ca");

  useEffect(() => {
    const maLoai = loaiFilter !== "tat_ca" ? loaiFilter : undefined;
    const trangThai = trangThaiFilter !== "tat_ca" ? trangThaiFilter : undefined;
    fetchDanhSachSuCo(maLoai, trangThai, 0, 100);
  }, [trangThaiFilter, loaiFilter]);

  const handleSelectLocation = (lon: number, lat: number) => {
    setMapCenter([lat, lon]);
    setMapZoom(16);
  };
  const { query, suggestions, isSerching, handQueryChange, handleSelect } = useLocationSearch(handleSelectLocation);
 
  if (error) {
    return <div className="error-message">{error}</div>;
  }
 
  return (
    <div className="ban-do-page">
      <IncidentSidebarList
        incidents={danhSachSuCo}
        loading={loading}
        emptyMessage="Không có sự cố nào đang chờ tiếp nhận tại Đà Nẵng."
        onIncidentClick={(lat, lon) => {
          setMapCenter([lat, lon]);
          setMapZoom(17);
        }}
      >
        <h2>Danh sách sự cố chờ tiếp nhận</h2>
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Nhập địa chỉ để tìm sự cố gần đó..."
              value={query}
              onChange={handQueryChange}
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {isSerching && <li className="suggestion-item loading">Đang tìm kiếm...</li>}
              {suggestions.map((item) => (
                <li
                  key={item.place_id}
                  className="suggestion-item"
                  onClick={() => handleSelect(item)}
                >
                  <MapPin size={16} />
                  <span>{item.display_name}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="filter" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <select
              value={trangThaiFilter}
              onChange={e => setTrangThaiFilter(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f1f3f4' }}
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="CHO_TIEP_NHAN">Chờ tiếp nhận</option>
              <option value="DA_TIEP_NHAN">Đã tiếp nhận</option>
              <option value="DANG_XU_LY">Đang xử lý</option>
            </select>
            <select
              value={loaiFilter}
              onChange={e => setLoaiFilter(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f1f3f4' }}
            >
              <option value="tat_ca">Tất cả loại sự cố</option>
              {danhSachLoai.map(loai => (
                <option key={loai.maLoai} value={loai.tenLoaiSuCo}>{loai.tenLoaiSuCo}</option>
              ))}
            </select>
          </div>
        </div>
      </IncidentSidebarList>

      <div className="map-area">
        <IncidentMap loai ="NGUOI_DAN" incidents={danhSachSuCo} mapCenter={mapCenter} mapZoom={mapZoom} />
      </div>
    </div>
  );
};

export default BanDoPage;
