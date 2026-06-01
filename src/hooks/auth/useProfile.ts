import { useState, useEffect } from "react";
import { GetProfileService, UpdateProfileService } from "../../services/AuthService";
import type { ProfileResponse, UpdateProfileRequest } from "../../types/Auth";
export const useProfile = () => {

    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetProfileService();
            setProfile(res.data);
        } catch (err) {
            setError("Failed to fetch profile");
        }
        setLoading(false);
    };

    const updateProfile = async (updateData: UpdateProfileRequest): Promise<boolean> => {
        setUpdating(true);
        setError(null);
        try {
            await UpdateProfileService(updateData);
            await fetchProfile(); 
            return true;
        }
        catch (err) {
            setError("Failed to update profile");
            return false;
        }
        setUpdating(false);
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        updating,
        updateProfile,
    };
}