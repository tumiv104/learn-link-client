import api from "@/lib/api"
import type { ChildProgressReportDTO } from "@/data/childProgressReport"

export async function getChildProgressReport(
  childId: number,
  period: "all" | "day" | "week" | "month" | "year"
): Promise<ChildProgressReportDTO> {
  const res = await api.get(`/Report/child-progress/${childId}?period=${period}`)
  return res.data.data as ChildProgressReportDTO
}