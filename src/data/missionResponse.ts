export interface MissionResponse {
  missionId: number
  title: string
  description: string
  points: number
  promise?: string | null
  punishment?: string | null
  status: "Assigned" | "Submitted" | "Processing" | "Completed"
  deadline: string
  createdAt: string
  childId: number
  childName?: string
  attachmentUrl?: string
  lastSubmittedAt?: string
}