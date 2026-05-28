import type {PhieuMoLaiResponse} from "../../types/PhieuMoLai";
import {GetPhieuMoLaiByIdService} from "../../services/PhieuMoLaiService";
import {useState, useEffect} from "react";

export const useDuyetMoLai = ({maPhieuMoLai}:{maPhieuMoLai: string}) => {
    const [phieuMoLaiData, setPhieuMoLaiData] = useState<PhieuMoLaiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPhieuMoLaiData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetPhieuMoLaiByIdService(maPhieuMoLai);
            setPhieuMoLaiData(response.data);
        } catch (err) {
            setError("Failed to fetch Phieu Mo Lai data.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (maPhieuMoLai) {
            fetchPhieuMoLaiData();
        }
    }, [maPhieuMoLai]);

    return { phieuMoLaiData, loading, error };


}