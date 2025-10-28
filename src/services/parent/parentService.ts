import api from "@/lib/api";
import { ChildBasicInfoDTO } from "@/data/ChildBasicInfoDTO";
import { UserProfileDTO } from "@/data/UserProfileDTO";


export async function getParentProfile(userId: number) {
  const res = await api.get(`/User/profile/${userId}`)
  return res.data.data as { isPremium: boolean; premiumExpiry?: string }
}


export async function getChildren(parentId: number){
  const res = await api.get(`/Parent/${parentId}/children`);
  return res.data.data as ChildBasicInfoDTO[];
}

export async function createChild(parentId: number, formData: FormData) {
  const res = await api.post(`/Parent/${parentId}/children`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to create child account")
  }

  return res.data
}


export async function getChildProfile(parentId: number, childId: number): Promise<UserProfileDTO> {
  const res = await api.get(`/Parent/${parentId}/children/${childId}`)
  return res.data.data as UserProfileDTO
}