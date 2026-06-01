import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateSucoService } from "../../services/SucoService";
import type { CreateSucoRequest } from "../../types/Suco";
export const useCreateSuco = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateSucoRequest>({
    noiDung: "",
    diaDiem: "",
    kinhDo: 0,
    viDo: 0,
    mediaUrls: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setLocation = (kinhDo: number, viDo: number, diaDiem: string) => {
    setForm((prev) => ({ ...prev, kinhDo, viDo, diaDiem }));
    setErrors((prev) => ({ ...prev, kinhDo: "", viDo: "", diaDiem: "" }));
  };

  const setMediaUrls = (
    urls: string[] | ((prev: string[]) => string[])
  ) => {
    setForm((prev) => ({
      ...prev,
      mediaUrls:
        typeof urls === "function" ? urls(prev.mediaUrls??[]) : urls,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.noiDung.trim()) newErrors.noiDung = "Không được để trống";
    if (!form.diaDiem.trim()) newErrors.diaDiem = "Không được để trống";
    if (form.kinhDo === 0 && form.viDo === 0)
      newErrors.kinhDo = "Chọn vị trí";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("FORM SUBMIT:", form);

    if (!validate()) return;

    try {
      setLoading(true);

      const payload: CreateSucoRequest = {
        ...form,
        mediaUrls: (form.mediaUrls || []).filter(Boolean),
      };

      const res = await CreateSucoService(payload);

      if (res.status !== 201) {
        alert("Thất bại");
        return;
      }

      alert("Thành công!");
      navigate("danh-sach-su-co");
    } catch (err) {
      console.error(err);
      alert("Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setLocation,
    setMediaUrls,
  };
};