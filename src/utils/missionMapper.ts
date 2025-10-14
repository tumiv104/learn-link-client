import { Mission } from "@/data/mission"
import { MissionResponse } from "@/data/missionResponse"

export function mapMissionResponse(res: MissionResponse): Mission {
  return {
    MissionId: res.missionId,
    Title: res.title,
    Description: res.description,
    Points: res.points,
    Status: res.status,
    Deadline: res.deadline,
    CreatedAt: res.createdAt,
    ChildId: res.childId,
    Promise: res.promise,
    Punishment: res.punishment,
    ChildName: res.childName,
    AttachmentUrl: res.attachmentUrl,
  }
}
