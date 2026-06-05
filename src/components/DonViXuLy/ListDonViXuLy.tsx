import { useState } from "react";
import { useListDonViXuLy } from "../../hooks/donvixuly/useListDonViXuLy";
import type { DonViXuLyResponse } from "../../types/DonViXuLy";
import "./ListDonViXuLy.scss";

type Props = {
    selectedDonViList: DonViXuLyResponse[];
    onSelect: (dv: DonViXuLyResponse) => void;
};

const ListDonViXuLy = ({
    selectedDonViList,
    onSelect
}: Props) => {

    const { loading, error, donViXuLyList } = useListDonViXuLy();

    const [hoveredDonVi, setHoveredDonVi] =
        useState<DonViXuLyResponse | null>(null);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="ListDonVi">
            <ul>
                {donViXuLyList.map((dv) => (
                    <li
                        key={dv.maDonViXuLy}
                        onClick={() => onSelect(dv)}
                        onMouseEnter={() => setHoveredDonVi(dv)}
                        onMouseLeave={() => setHoveredDonVi(null)}
                        className={
                            selectedDonViList.some(
                                item =>
                                    item.maDonViXuLy === dv.maDonViXuLy
                            )
                                ? "selected"
                                : ""
                        }
                    >
                        {dv.tenDonVi}
                    </li>
                ))}
            </ul>

            {hoveredDonVi && (
                <div className="moTaBox">
                    <h3>{hoveredDonVi.tenDonVi}</h3>
                    <p>{hoveredDonVi.moTa}</p>
                </div>
            )}
        </div>
    );
};

export default ListDonViXuLy;