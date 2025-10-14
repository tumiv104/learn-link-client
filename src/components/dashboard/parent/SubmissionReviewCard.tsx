import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"
import { Submission } from "@/data/submission"

interface SubmissionReviewCardProps {
  submission: Submission
  onViewDetail?: (submission: Submission) => void
  onReview?: (submission: Submission) => void
}

export function SubmissionReviewCard({ submission, onViewDetail, onReview }: SubmissionReviewCardProps) {
  const t = useTranslations("parentDashboard.submissions")
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{submission.Title}</h3>
            <p className="text-gray-600 mb-2">{t("submittedBy")}: {submission.ChildName}</p>
            <div className="flex items-center gap-4 mb-3">
              <Badge
                className={
                  submission.Status === "Approved"
                    ? "bg-green-500 text-white"
                    : submission.Status === "Rejected"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                }
              >
                {submission.Status}
              </Badge>
              <span className="text-sm text-gray-500">
                <Clock className="w-4 h-4 inline mr-1" />
                {new Date(submission.SubmittedAt).toLocaleDateString()}
              </span>
              {submission.Score !== undefined && (
                <span className="text-sm font-medium text-green-600">{t("score")}: {submission.Score}/100</span>
              )}
            </div>
            {submission.Feedback && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">{submission.Feedback}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetail?.(submission)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {t("viewDetail")}
            </Button>
            {submission.Status === "Pending" && (
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                onClick={() => onReview?.(submission)}
              >
                <MessageSquare className="w-4 h-4" />
                {t("review")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
