import api from "@/lib/api";
import { UserProfileDTO } from "@/data/UserProfileDTO"; 

// Lấy profile của user hiện tại
export async function getUserProfile(): Promise<UserProfileDTO> {
  const res = await api.get("/User/profile");
  return res.data.data as UserProfileDTO;
}

export async function updateUserProfile(formData: FormData) {
  const res = await api.put("/User/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export async function getUserProfileById(userId: number): Promise<UserProfileDTO> {
  const res = await api.get(`/User/profile`, { params: { userId } })
  return res.data.data as UserProfileDTO
}

