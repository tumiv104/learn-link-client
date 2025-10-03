export interface SubmissionDetailDTO {
  submissionId: number
  missionId: number
  title: string
  description: string
  points: number
  deadline?: string
  childId: number
  childName:string
  fileUrl?: string
  submittedAt: string
  status: string
  feedback?: string
  score?: number
  reviewedAt?: string
}
