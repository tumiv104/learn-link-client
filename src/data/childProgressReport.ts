export interface ChildProgressReportDTO {
  childId: number
  childName: string
  totalMissions: number
  completedMissions: number
  submittedMissions: number
  processingMissions: number
  assignedMissions: number
  totalPointsEarned: number
  lastSubmissionAt?: string
}
