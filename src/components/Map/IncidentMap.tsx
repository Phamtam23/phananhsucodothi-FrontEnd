import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, TreePine, AlertTriangle, TrafficCone, Droplets, Lightbulb, Zap, Trash2, Layers } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { useNavigate } from 'react-router-dom';
import { daNangBoundary } from '../../daNangBoundary';
import type {SucoTrenBanDo} from "../../pages/truongdonvi/BanDoTruongDonViPage";
import {TrangThaiSuCo} from "../../types/Suco"; 
import {TrangThaiPhanCong} from "../../types/PhieuPhanCong";
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

interface IncidentMapProps {
  incidents: SucoTrenBanDo[];
  mapCenter: [number, number];
  mapZoom: number;
  loai: "DIEU_PHOI" | "TRUONG_DON_VI" |"NGUOI_DAN";
}

const IncidentMap = ({ incidents, mapCenter, mapZoom, loai }: IncidentMapProps) => {
  const navigate = useNavigate();
  const handChiTietSuCo = (suco: SucoTrenBanDo) => {
     const { maSuCo, trangThai, trangThaiPhanCong, maPhieuPhanCong } = suco;

          if (loai === "DIEU_PHOI") {
              if (trangThai === TrangThaiSuCo.CHO_TIEP_NHAN) {
              navigate(`/nhanvien/kiem-duyet/${maSuCo}`);
              return;
            }

            navigate(`/nhanvien/phan-cong/${maSuCo}`);
            return;
          }

          if (loai === "TRUONG_DON_VI") {
            if (trangThaiPhanCong === TrangThaiPhanCong.CHO_XAC_NHAN) {
              navigate(`/truongdonvi/xac-minh`);
              return;
            }

            if (trangThaiPhanCong === TrangThaiPhanCong.DA_XAC_NHAN) {
              navigate(`/truongdonvi/phan-cong/${maPhieuPhanCong}`);
              return;
            }

            if (trangThaiPhanCong === TrangThaiPhanCong.CHO_DUYET_KET_QUA) {
              navigate(`/truongdonvi/duyet-ket-qua/${maPhieuPhanCong}`);
              return;
            }

            return;
          }

          navigate(`/suco/detail/${maSuCo}`);

    }


  // Da Nang Bounds
  const daNangBounds: L.LatLngBoundsExpression = [
    [15.9000, 107.8000], // South West
    [16.2500, 108.3500]  // North East
  ];

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      maxBounds={daNangBounds}
      maxBoundsViscosity={1.0}
      minZoom={11}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={mapCenter} zoom={mapZoom} />

      <Polygon
        positions={[
          [
            [-90, -180],
            [90, -180],
            [90, 180],
            [-90, 180],
          ],
          daNangBoundary
        ]}
        pathOptions={{ color: 'transparent', fillColor: '#f8f9fa', fillOpacity: 1 }}
      />
      <Polygon
        positions={daNangBoundary}
        pathOptions={{ color: '#0066cc', weight: 2, fillOpacity: 0, dashArray: '5, 5' }}
      />

      {incidents.map((incident) => {
        if (!incident.viDo || !incident.kinhDo) return null;
        const markerIcon = createCustomIcon(incident.loaiSuCos);
        return (
          <Marker
            key={incident.maSuCo}
            position={[incident.viDo, incident.kinhDo]}
            icon={markerIcon}
          >
            <Popup className="incident-popup">
              <div className="popup-content">
                <span className="popup-id">{incident.maSuCo}</span>
                <h4>{incident.tieuDe}</h4>
                <p className="popup-address"><MapPin size={14} /> {incident.diaDiem}</p>
               <button
                className="popup-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handChiTietSuCo(incident);
                }}
              >
                Xem chi tiết phản ánh
              </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default IncidentMap;
