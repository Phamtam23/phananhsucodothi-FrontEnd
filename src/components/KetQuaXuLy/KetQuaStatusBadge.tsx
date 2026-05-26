import {
    TrangThaiKetQua
} from "../../types/KetQuaXuLy";

type Props = {
    trangThai?: string;
};

const KetQuaStatusBadge = ({
    trangThai
}: Props) => {

    const getLabel = () => {

        switch (trangThai) {

            case TrangThaiKetQua.CHO_DUYET:
                return "Chờ duyệt";

            case TrangThaiKetQua.DA_DUYET:
                return "Đã duyệt";

            case TrangThaiKetQua.TU_CHOI:
                return "Đã từ chối";

            case TrangThaiKetQua.CONG_KHAI:
                return "Công khai";

            case TrangThaiKetQua.HOAN_THANH:
                return "Hoàn thành";

            default:
                return trangThai;
        }
    };

    return (
        <span
            className={`
        ketqua-status
        badge-${trangThai?.toLowerCase()}
      `}
        >
            {getLabel()}
        </span>
    );
};

export default KetQuaStatusBadge;