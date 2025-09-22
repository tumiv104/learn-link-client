import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Submission {
  SubmissionId: number
  MissionTitle: string
  ChildName: string
  Status: string
  SubmittedAt: string
  Feedback?: string | null
  Score?: number | null
}

interface SubmissionReviewCardProps {
  submission: Submission
}

export function SubmissionReviewCard({ submission }: SubmissionReviewCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{submission.MissionTitle}</h3>
            <p className="text-gray-600 mb-2">Submitted by: {submission.ChildName}</p>
            <div className="flex items-center gap-4 mb-3">
              <Badge variant={submission.Status === "Reviewed" ? "default" : "secondary"}>{submission.Status}</Badge>
              <span className="text-sm text-gray-500">
                <Clock className="w-4 h-4 inline mr-1" />
                {new Date(submission.SubmittedAt).toLocaleDateString()}
              </span>
              {submission.Score && (
                <span className="text-sm font-medium text-green-600">Score: {submission.Score}/100</span>
              )}
            </div>
            {submission.Feedback && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">{submission.Feedback}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View File
            </Button>
            {submission.Status === "Pending Review" && (
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
