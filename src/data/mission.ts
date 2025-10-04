import { SubmissionResponse } from "./submission"

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

export interface MissionSubmission {
  missionId: number
  title: string
  description: string
  points: number
  deadline: string
  missionStatus: string
  promise?: string | null
  punishment?: string | null
  attachmentUrl?: string
  createdAt: string
  submission: SubmissionResponse
}