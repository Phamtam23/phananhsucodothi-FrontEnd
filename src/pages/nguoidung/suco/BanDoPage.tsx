import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin } from 'lucide-react';
import { GetSuCoByTrangThaiService, GetALLSuCoService } from '../../../services/SucoService';
import { GetAllLoaiService } from '../../../services/LoaiService';
import type { SucoSumaryResponse } from '../../../types/Suco';
import type { LoaiResponse } from '../../../types/Loai';
import { useLocationSearch } from '../../../hooks/suco/uselocationsearch';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { daNangBoundary } from '../../../daNangBoundary';
import { renderToString } from 'react-dom/server';
import { TreePine, AlertTriangle, TrafficCone, Droplets, Lightbulb, Zap, Trash2, Layers } from 'lucide-react';
import IncidentMap from '../../../components/Map/IncidentMap';
import IncidentSidebarList from '../../../components/Map/IncidentSidebarList';
import './BanDoPage.scss';

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A component to center map
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5
    });
  }, [center, zoom, map]);
  return null;
}

const getIconForTypes = (loaiSuCos: string[]) => {
  if (!loaiSuCos || loaiSuCos.length === 0) {
    return <AlertTriangle size={20} color="#fff" />;
  }

  if (loaiSuCos.length > 1) {
    return <Layers size={20} color="#fff" />;
  }

  const type = loaiSuCos[0].toLowerCase();
  if (type.includes("cây") || type.includes("phượng")) return <TreePine size={20} color="#fff" />;
  if (type.includes("giao thông") || type.includes("đường")) return <TrafficCone size={20} color="#fff" />;
  if (type.includes("ngập") || type.includes("nước")) return <Droplets size={20} color="#fff" />;
  if (type.includes("điện") || type.includes("cáp")) return <Zap size={20} color="#fff" />;
  if (type.includes("sáng") || type.includes("đèn")) return <Lightbulb size={20} color="#fff" />;
  if (type.includes("rác") || type.includes("môi trường") || type.includes("ô nhiễm")) return <Trash2 size={20} color="#fff" />;

  return <AlertTriangle size={20} color="#fff" />;
};

const createCustomIcon = (loaiSuCos: string[]) => {
  const iconComponent = getIconForTypes(loaiSuCos);
  const iconHtml = renderToString(iconComponent);

  let bgColor = '#f5222d'; // red
  if (loaiSuCos && loaiSuCos.length > 1) bgColor = '#722ed1'; // purple
  else if (loaiSuCos && loaiSuCos.length === 1) {
    const t = loaiSuCos[0].toLowerCase();
    if (t.includes("cây")) bgColor = '#52c41a'; // green
    else if (t.includes("nước") || t.includes("ngập")) bgColor = '#1890ff'; // blue
    else if (t.includes("điện") || t.includes("sáng") || t.includes("giao thông")) bgColor = '#faad14'; // yellow
  }

  return L.divIcon({
    html: `<div style="background-color: ${bgColor}; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${iconHtml}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const BanDoPage = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<SucoSumaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0544, 108.2022]); // Default center Da Nang
  const [mapZoom, setMapZoom] = useState(13);

  // Filters
  const [trangThaiFilter, setTrangThaiFilter] = useState<string>("CHO_TIEP_NHAN");
  const [loaiFilter, setLoaiFilter] = useState<string>("tat_ca");
  const [loaiList, setLoaiList] = useState<LoaiResponse[]>([]);

  // Fetch loai
  useEffect(() => {
    const fetchLoai = async () => {
      try {
        const res = await GetAllLoaiService();
        setLoaiList(res.data ?? []);
      } catch (error) {
        console.error("Error fetching types", error);
      }
    };
    fetchLoai();
  }, []);

  // Da Nang Bounds
  const daNangBounds: L.LatLngBoundsExpression = [
    [15.9000, 107.8000], // South West
    [16.2500, 108.3500]  // North East
  ];

  // Search logic
  const handleSelectLocation = (lon: number, lat: number) => {
    setMapCenter([lat, lon]);
    setMapZoom(16);
  };

  const { query, suggestions, isSerching, handQueryChange, handleSelect } = useLocationSearch(handleSelectLocation);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        let response;
        if (trangThaiFilter === "tat_ca") {
          response = await GetALLSuCoService(0, 1000);
        } else {
          response = await GetSuCoByTrangThaiService(trangThaiFilter, 0, 1000);
        }

        // Filter incidents to make sure they are within Da Nang area
        let daNangIncidents = (response.data?.content ?? []).filter(incident => {
          if (incident.viDo && incident.kinhDo) {
            return incident.viDo >= 15.9000 && incident.viDo <= 16.2500 &&
              incident.kinhDo >= 107.8000 && incident.kinhDo <= 108.3500;
          }

          // Fallback: If backend is missing viDo/kinhDo, check the address text
          if (incident.diaDiem) {
            const loc = incident.diaDiem.toLowerCase();
            return loc.includes("đà nẵng") || loc.includes("da nang");
          }
          return false;
        });

        // Filter by Loai
        if (loaiFilter !== "tat_ca") {
          daNangIncidents = daNangIncidents.filter(incident =>
            incident.loaiSuCos && incident.loaiSuCos.includes(loaiFilter)
          );
        }

        setIncidents(daNangIncidents);
      } catch (error) {
        console.error("Error fetching incidents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, [trangThaiFilter, loaiFilter]);

  return (
    <div className="ban-do-page">
      <IncidentSidebarList
        incidents={incidents}
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

          <div className="filter-group" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <select
              value={trangThaiFilter}
              onChange={e => setTrangThaiFilter(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f1f3f4' }}
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="CHO_TIEP_NHAN">Chờ tiếp nhận</option>
              <option value="DA_TIEP_NHAN">Đã tiếp nhận</option>
              <option value="DANG_XU_LY">Đang xử lý</option>
              <option value="DA_HOAN_THANH">Đã hoàn thành</option>
              <option value="TU_CHOI">Từ chối</option>
              <option value="LA_SPAM">Spam</option>
            </select>

            <select
              value={loaiFilter}
              onChange={e => setLoaiFilter(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f1f3f4' }}
            >
              <option value="tat_ca">Tất cả loại sự cố</option>
              {loaiList.map(loai => (
                <option key={loai.maLoai} value={loai.tenLoaiSuCo}>{loai.tenLoaiSuCo}</option>
              ))}
            </select>
          </div>
        </div>
      </IncidentSidebarList>

      <div className="map-area">
        <IncidentMap loai ="NGUOI_DAN" incidents={incidents} mapCenter={mapCenter} mapZoom={mapZoom} />
      </div>
    </div>
  );
};

export default BanDoPage;
