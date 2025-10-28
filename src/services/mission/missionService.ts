import api from "@/lib/api"
import type { MissionResponse } from "@/data/missionResponse"
import type { PageResult } from "@/data/pagination"

export async function assignMission(parentId: number, fd: FormData) {
  const res = await api.post(`/mission/${parentId}/assign`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function editMission(parentId: number, id: string, fd: FormData) {
  const res = await api.put(`/${parentId}/mission/edit/${id}`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
  return res.data;
}

export async function getParentMissions(
  parentId: number,
  page = 1,
  pageSize = 5
): Promise<PageResult<MissionResponse>> {
  const res = await api.get(`/mission/parent-missions/${parentId}?page=${page}&pageSize=${pageSize}`)
  return res.data.data as PageResult<MissionResponse>
}

export async function getAllMission() {
    const res = await api.get(`/mission/child-missions`);
    return res.data;
}

export async function getAllMissionByStatus(status: string) {
  const res = await api.get(`/mission/child/status?status=${status}`);
  return res.data;
}