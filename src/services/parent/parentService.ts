import api from "@/lib/api";
import { ChildBasicInfoDTO } from "@/data/ChildBasicInfoDTO";
import { UserProfileDTO } from "@/data/UserProfileDTO";


export async function getParentProfile() {
  const res = await api.get("/User/profile")
  return res.data.data as { isPremium: boolean; premiumExpiry?: string }
}


export async function getChildren(){
  const res = await api.get("/Parent/children");
  return res.data.data as ChildBasicInfoDTO[];
}

export async function createChild(formData: FormData) {
  const res = await api.post("/Parent/children", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to create child account")
  }

  return res.data
}


export async function getChildProfile(childId: number): Promise<UserProfileDTO> {
  const res = await api.get(`/Parent/children/${childId}`)
  return res.data.data as UserProfileDTO
}