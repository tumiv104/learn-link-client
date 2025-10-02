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