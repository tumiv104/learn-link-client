import api from "@/lib/api";

export interface MissionResponse {
  missionId: number
  title: string
  description: string
  childName: string
  status: string
  points: number
  deadline: string
  promise?: string | null
}

export async function getAllMission() {
    const res = await api.get(`/mission/child-missions`);
    return res.data;
}