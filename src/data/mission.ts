export interface Mission {
  MissionId: number
  Title: string
  Description: string
  Points: number
  Promise?: string | null
  Punishment?: string | null
  Deadline: string
  Status: "Assigned" | "Submitted" | "Processing" | "Completed"
  ChildId: number
  CreatedAt: string
  ChildName?: string
  AttachmentUrl?: string
}