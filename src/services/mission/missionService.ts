import api from "@/lib/api"
import type { MissionResponse } from "@/data/missionResponse"
import type { PageResult } from "@/data/pagination"

export async function assignMission(fd: FormData) {
  const res = await api.post("/mission/assign", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function getParentMissions(
  page = 1,
  pageSize = 5
): Promise<PageResult<MissionResponse>> {
  const res = await api.get(`/mission/parent-missions?page=${page}&pageSize=${pageSize}`)
  return res.data.data as PageResult<MissionResponse>
}