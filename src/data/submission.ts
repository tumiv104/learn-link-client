export interface Submission {
    SubmissionId: number
    MissionId: number
    Title: string
    Description: string
    Points: number
    Deadline?: string
    ChildId: number
    ChildName: string
    FileUrl?: string
    SubmittedAt: string
    Status: string
    Feedback?: string
    Score?: number | null
    ReviewedAt?: string
}

export interface SubmissionResponse {
    submissionId: number
    missionId: number
    childId: number
    fileUrl?: string
    submittedAt: string
    status: string
    feedback?: string
    score?: number | null
    reviewedAt?: string
}