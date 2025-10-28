import api from "@/lib/api"
import type { ParentOverview } from "@/data/parentOverview"

export async function getParentOverview(parentId: number): Promise<ParentOverview> {
  const res = await api.get(`/dashboard/parent-overview/${parentId}`)
  return res.data.data as ParentOverview
}
