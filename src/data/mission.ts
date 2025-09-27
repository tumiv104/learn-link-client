export interface Mission {
  MissionId: number
  Title: string
  Description: string
  Points: number
  Promise?: string | null
  Deadline: string
  Status: "Assigned" | "Submitted" | "Processing" | "Completed"
  ChildId: number
  createdAt: string
  childName?: string
}