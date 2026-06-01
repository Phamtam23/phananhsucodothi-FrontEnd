import { useState } from "react";
import { CreatePhieuMoLaiService } from "../../services/PhieuMoLaiService";
import type { CreatePhieuMoLaiRequest } from "../../types/PhieuMoLai";
export const usePhieuMoLai = () => {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const create = async (
        payload: CreatePhieuMoLaiRequest
    ) => {

        try {

            setLoading(true);
            setError("");

            await CreatePhieuMoLaiService(payload);

            return true;

        } catch (err: any) {

            setError(
                err.response?.data?.message ||
                "Có lỗi xảy ra"
            );

            return false;

        } finally {

            setLoading(false);
        }
    };

    return {
        loading,
        error,
        create
    };
}