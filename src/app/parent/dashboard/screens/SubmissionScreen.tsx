"use client"

import { SubmissionReviewCard } from "@/components/dashboard/parent/SubmissionReviewCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { SubmissionDetailModal } from "@/components/dashboard/parent/SubmissionDetailModal"
import { ReviewSubmissionDialog } from "@/components/dashboard/parent/ReviewSubmissionDialog"
import { useEffect, useState } from "react"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"
import { getParentSubmissions, reviewSubmission } from "@/services/submission/submissionService"
import type { SubmissionDetailDTO } from "@/data/submissionDetail"
import type { PageResult } from "@/data/pagination"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

export default function SubmissionScreen() {
  const t = useTranslations("parentDashboard.submissions")
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [submissions, setSubmissions] = useState<SubmissionDetailDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 5

  const [submissionDetailModal, setSubmissionDetailModal] = useState({
    open: false,
    submission: undefined as any,
  })

  const [reviewSubmissionDialog, setReviewSubmissionDialog] = useState({
    open: false,
    submission: undefined as any,
  })

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const data: PageResult<SubmissionDetailDTO> = await getParentSubmissions(page, pageSize)
      setSubmissions(data.items)
      setTotalPages(data.totalPages)
      setTotalCount(data.totalCount)
    } catch (err) {
      console.error("Error fetching submissions:", err)
      showError("Error", "Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [page])

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

  const handleSubmitReview = async (submissionId: string, feedback: string, score: number, approved: boolean) => {
    try {
      await reviewSubmission(Number(submissionId), feedback, score, approved)

      setTimeout(() => {
        if (approved) {
          showSuccess(t("alerts.approved.title"), t("alerts.approved.message", { score }))
        } else {
          showError(t("alerts.rejected.title"), t("alerts.rejected.message"))
        }
        // Refresh submissions after review
        fetchSubmissions()
      }, 500)
    } catch (err) {
      showError("Error", "Failed to submit review")
    }
  }

  const pendingCount = submissions.filter((s) => s.status === "Pending").length

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
          {t("pending", { count: pendingCount })}
        </Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No submissions yet</div>
      ) : (
        <>
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <SubmissionReviewCard
                key={submission.submissionId}
                submission={{
                  SubmissionId: submission.submissionId,
                  MissionId: submission.missionId,
                  Title: submission.title,
                  Description: submission.description,
                  Points: submission.points,
                  Deadline: submission.deadline,
                  ChildId: submission.childId,
                  ChildName: submission.childName, 
                  FileUrl: submission.fileUrl,
                  SubmittedAt: submission.submittedAt,
                  Status: submission.status,
                  Feedback: submission.feedback,
                  Score: submission.score,
                  ReviewedAt: submission.reviewedAt,
                }}
                onViewDetail={handleViewSubmissionDetail}
                onReview={handleReviewSubmission}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
                submissions
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
