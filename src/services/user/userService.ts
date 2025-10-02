import api from "@/lib/api";
import { UserProfileDTO } from "@/data/UserProfileDTO"; 

// Lấy profile của user hiện tại
export async function getUserProfile(): Promise<UserProfileDTO> {
  const res = await api.get("/User/profile");
  return res.data.data as UserProfileDTO;
}
