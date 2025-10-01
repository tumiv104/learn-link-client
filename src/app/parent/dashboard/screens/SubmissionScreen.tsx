'use client'

import { SubmissionReviewCard } from "@/components/dashboard/parent/SubmissionReviewCard"
import { Badge } from "@/components/ui/badge"
import { mockData } from "@/data/mockData"
import { useTranslations } from "next-intl"
import { SubmissionDetailModal } from "@/components/dashboard/parent/SubmissionDetailModal"
import { ReviewSubmissionDialog } from "@/components/dashboard/parent/ReviewSubmissionDialog"
import { useState } from "react"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"

export default function SubmissionScreen() {
  const t = useTranslations("parentDashboard.submissions")
  const { alert, showSuccess, showError, hideAlert } = useAlert()
  
  const [submissionDetailModal, setSubmissionDetailModal] = useState({
    open: false,
    submission: undefined as any,
  })
  
  const [reviewSubmissionDialog, setReviewSubmissionDialog] = useState({
    open: false,
    submission: undefined as any,
  })

    const handleViewSubmissionDetail = (submission: any) => {
    setSubmissionDetailModal({
      open: true,
      submission,
    })
  }

  const handleReviewSubmission = (submission: any) => {
    setReviewSubmissionDialog({
      open: true,
      submission,
    })
  }

  const handleSubmitReview = (submissionId: string, feedback: string, score: number, approved: boolean) => {
    setTimeout(() => {
      if (approved) {
        showSuccess(t("alerts.approved.title"),
        t("alerts.approved.message", { score }))
      } else {
        showError(t("alerts.rejected.title"),
        t("alerts.rejected.message"))
      }
    }, 500)
  }

    return (
      <div className="space-y-6">
        {alert && <AlertPopup type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}
        {submissionDetailModal.submission && (
        <SubmissionDetailModal
          open={submissionDetailModal.open}
          onClose={() => setSubmissionDetailModal({ open: false, submission: undefined })}
          submission={submissionDetailModal.submission}
        />
        )}

        {reviewSubmissionDialog.submission && (
        <ReviewSubmissionDialog
          open={reviewSubmissionDialog.open}
          onClose={() => setReviewSubmissionDialog({ open: false, submission: undefined })}
          submission={reviewSubmissionDialog.submission}
          onReview={handleSubmitReview}
        />
        )}
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
            <Badge variant="secondary" className="text-sm">
                {t("pending", { count: mockData.submissions.filter((s) => s.Status === "Pending").length })}
            </Badge>
            </div>

            <div className="grid gap-4">
            {mockData.submissions.map((submission) => (
                <SubmissionReviewCard submission={submission} onViewDetail={handleViewSubmissionDetail}
                    onReview={handleReviewSubmission}/>
            ))}
        </div>
      </div>
    )
}