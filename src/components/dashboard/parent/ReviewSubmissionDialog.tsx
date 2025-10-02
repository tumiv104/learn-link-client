"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { CheckCircle, XCircle, Star, MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"

interface ReviewSubmissionDialogProps {
  open: boolean
  onClose: () => void
  submission: {
    SubmissionId: string
    MissionTitle: string
    ChildName: string
    FileUrl?: string
  }
  onReview: (submissionId: string, feedback: string, score: number, approved: boolean) => void
}

export function ReviewSubmissionDialog({ open, onClose, submission, onReview }: ReviewSubmissionDialogProps) {
  const t = useTranslations("parentDashboard.submissions")
  const { alert, showSuccess, showError, hideAlert } = useAlert()
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState<number>(0)

  const handleApprove = () => {
    if (!feedback.trim()) {
      showError(
        t("alerts.validation.feedbackRequired.title"),
        t("alerts.validation.feedbackRequired.messageApprove")
      )
      return
    }
    if (score < 0 || score > 100) {
      showError(
        t("alerts.validation.invalidScore.title"),
        t("alerts.validation.invalidScore.message")
      )
      return
    }
    onReview(submission.SubmissionId, feedback, score, true)
    handleClose()
  }

  const handleReject = () => {
    if (!feedback.trim()) {
      showError(
        t("alerts.validation.feedbackRequired.title"),
        t("alerts.validation.feedbackRequired.messageReject")
      )
      return
    }
    onReview(submission.SubmissionId, feedback, 0, false)
    handleClose()
  }

  const handleClose = () => {
    setFeedback("")
    setScore(0)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {alert && <AlertPopup type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            {t("reviewDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Submission Info */}
          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-1">{submission.MissionTitle}</h3>
            <p className="text-sm text-gray-600">{t("submittedBy")}: {submission.ChildName}</p>
            {submission.FileUrl && (
              <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                <a href={submission.FileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  {t("reviewDialog.viewFile")} →
                </a>
              </Button>
            )}
          </div>

          {/* Score Input */}
          <div className="space-y-2">
            <Label htmlFor="score" className="text-base font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              {t("reviewDialog.scoreLabel")}
            </Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              placeholder={t("reviewDialog.scorePlaceholder")}
              className="text-lg font-bold"
            />
          </div>

          {/* Feedback Input */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              {t("reviewDialog.feedbackLabel")}
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t("reviewDialog.feedbackPlaceholder")}
              className="min-h-[120px] text-base"
            />
            <p className="text-xs text-gray-500">{t("reviewDialog.feedbackTip")}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t("actions.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {t("actions.reject")}
          </Button>
          <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t("actions.approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
