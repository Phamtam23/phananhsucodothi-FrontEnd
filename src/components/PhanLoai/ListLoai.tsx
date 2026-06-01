import { useListLoai } from "../../hooks/phanloai/useListLoai";
import type { LoaiResponse } from "../../types/Loai";
import "./ListLoai.scss";
type Props = {
  selectedLoaiList: LoaiResponse[];

  onSelect: (
    loai: LoaiResponse
  ) => void;
};
const ListLoai = ({ selectedLoaiList, onSelect }: Props) => {
    const { loading, error, loaiList } = useListLoai();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="ListLoai">
            <ul>
                {loaiList.map((loai) => (
                    <li 
                        key={loai.maLoai} 
                        onClick={() => onSelect(loai)}
                        className={selectedLoaiList.some((l) => l.maLoai === loai.maLoai) ? "selected" : ""}
                    >
                        {loai.tenLoaiSuCo}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListLoai;