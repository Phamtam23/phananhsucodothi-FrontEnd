import { Check, X } from "lucide-react";

type Props = {
    maKetQuaXuLy: string;

    dangXuLyHanhDong: boolean;

    maKetQuaDangTuChoi: string | null;

    noiDungTuChoi: string;

    setMaKetQuaDangTuChoi: (
        id: string | null
    ) => void;

    setNoiDungTuChoi: (
        value: string
    ) => void;

    onDuyet: (
        maKetQua: string
    ) => void;

    onTuChoi: (
        maKetQua: string
    ) => void;
};

const KetQuaXuLyActions = ({ maKetQuaXuLy, dangXuLyHanhDong, maKetQuaDangTuChoi, noiDungTuChoi, setMaKetQuaDangTuChoi, setNoiDungTuChoi, onDuyet, onTuChoi }: Props) => {
    const dangNhapLyDoTuChoi = maKetQuaDangTuChoi === maKetQuaXuLy;
    return (
        <div className="dkq-actions-area">
            {dangNhapLyDoTuChoi ? (
                <div className="dkq-tu-choi-area">
                    <textarea
                        placeholder="Nhập lý do yêu cầu nhân viên làm lại..."
                        value={noiDungTuChoi}
                        onChange={(e) =>
                            setNoiDungTuChoi(e.target.value)
                        }
                        disabled={dangXuLyHanhDong}
                    />
                    <div>
                        <button className="btn-cancel" disabled={dangXuLyHanhDong}
                            onClick={() => {
                                setMaKetQuaDangTuChoi(null);
                                setNoiDungTuChoi("");
                            }}
                        >

                        </button>
                        <button className="bth-confirm-reject"
                            disabled={dangXuLyHanhDong}
                            onClick={() => {
                                onTuChoi(maKetQuaXuLy);
                            }}
                        >
                            Xác nhận yêu cầu làm lại
                        </button>

                    </div>
                </div>
            ) : (

                <div>
                    <button className="btn-approve"
                        disabled={dangXuLyHanhDong}
                        onClick={() => {
                            onDuyet(maKetQuaXuLy);
                        }}>
                        <Check size={16} />
                        Duyệt kết quả
                    </button>
                    <button className="btn-reject"
                        disabled={dangXuLyHanhDong}
                        onClick={() =>
                            setMaKetQuaDangTuChoi(maKetQuaXuLy)
                        }>
                        <X size={16} />
                        Yêu cầu làm lại
                    </button>
                </div>
            )}
        </div>
    );
};
export default KetQuaXuLyActions;