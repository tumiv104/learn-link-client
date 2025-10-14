import api from "@/lib/api"
import type { ParentOverview } from "@/data/parentOverview"

export async function getParentOverview(): Promise<ParentOverview> {
  const res = await api.get("/dashboard/parent-overview")
  return res.data.data as ParentOverview
}
