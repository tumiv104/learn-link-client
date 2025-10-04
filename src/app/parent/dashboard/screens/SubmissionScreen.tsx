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
import { approveSubmission, getParentSubmissions, rejectSubmission, reviewSubmission } from "@/services/submission/submissionService"
import type { SubmissionDetailDTO } from "@/data/submissionDetail"
import type { PageResult } from "@/data/pagination"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { PaginationBar } from "@/components/dashboard/PaginationBar"
import { usePagination } from "@/hooks/usePagination"

export default function SubmissionScreen() {
  const t = useTranslations("parentDashboard.submissions")
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [submissions, setSubmissions] = useState<SubmissionDetailDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const { page, setPage, pageSize, setPageSize, getPageNumbers } = usePagination(totalPages, 1, 5)
  const [totalCount, setTotalCount] = useState(0)

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

  const handleSubmitReview = async (submissionId: number, feedback: string, score: number, approved: boolean) => {
    try {
      let success = false;
      if (approved) {
        const res = await approveSubmission(submissionId, score, feedback);
        success = res.success
      } else {
        const res = await rejectSubmission(submissionId, score, feedback);
        success = res.success
      }
      if (success) {
        if (approved) {
          showSuccess(t("alerts.approved.title"), t("alerts.approved.message", { score }))
        } else {
          showError(t("alerts.rejected.title"), t("alerts.rejected.message"))
        }
        fetchSubmissions()
      }
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
        )}
        <PaginationBar
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
          getPageNumbers={getPageNumbers}
        />
    </div>
  )
}
