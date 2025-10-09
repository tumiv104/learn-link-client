"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Star, FileText, CheckCircle, Download, Gift, AlertTriangle, Trophy, User } from "lucide-react"
import { Submission } from "@/data/submission"
import { useLocale, useTranslations } from "next-intl"
import { formatDateTime } from "@/utils/formatDateTime"

interface SubmissionDetailModalProps {
  open: boolean
  onClose: () => void
  submission: Submission
}

export function SubmissionDetailModal({ open, onClose, submission }: SubmissionDetailModalProps) {
    const t = useTranslations("parentDashboard.submissions")
    const locale = useLocale()
    const getStatusColor = (status: string) => {
    switch (status) {
        case "Approved":
        return "bg-green-500"
        case "Rejected":
        return "bg-red-500"
        case "Pending Review":
        return "bg-yellow-500"
        default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            {t("detailTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mission Information */}
          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              {t("missionInfo")}
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="text-xl font-bold text-gray-800">{submission.Title}</h4>
                {submission.Description && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{submission.Description}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {submission.Points && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border-2 border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600 font-bold">{t("points")}</span>
                    </div>
                    <p className="text-2xl font-black text-yellow-600">{submission.Points}</p>
                  </div>
                )}

                {submission.Deadline && (
                  <div className="bg-white rounded-lg p-3 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="text-xs text-gray-600 font-bold">{t("deadline")}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      {/* {new Date(submission.Deadline).toLocaleDateString()} */}
                      {formatDateTime(submission.Deadline, locale)}
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg p-3 border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-bold">{t("child")}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700">{submission.ChildName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Information */}
          <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              {t("submissionInfo")}
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                  <p className="text-xs text-gray-600 font-bold mb-1">{t("status")}</p>
                  <Badge className={`${getStatusColor(submission.Status)} text-white text-sm`}>
                    {t(`submissionStatus.${submission.Status}`)}
                  </Badge>
                </div>

                <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                  <p className="text-xs text-gray-600 font-bold mb-1">{t("submitted")}</p>
                  <p className="text-sm font-bold text-gray-700">
                    {/* {new Date(submission.SubmittedAt).toLocaleDateString()} */}
                    {formatDateTime(submission.SubmittedAt, locale)}
                  </p>
                </div>

                {submission.Score !== undefined && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <p className="text-xs text-green-700 font-bold">{t("score")}</p>
                    </div>
                    <p className="text-2xl font-black text-green-700">{submission.Score}/100</p>
                  </div>
                )}

                {submission.ReviewedAt && (
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">{t("reviewed")}</p>
                    <p className="text-sm font-bold text-gray-700">
                      {new Date(submission.ReviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {submission.Feedback && (
                <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💬</span>
                    <p className="text-base font-bold text-yellow-800">{t("yourFeedback")}</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-yellow-300">
                    <p className="text-sm text-gray-800 leading-relaxed">{submission.Feedback}</p>
                  </div>
                </div>
              )}

              {submission.FileUrl && (
                <Button variant="outline" size="sm" className="w-full bg-white border-2 font-bold" asChild>
                  <a href={`${process.env.NEXT_PUBLIC_API_URL}${submission.FileUrl}`} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    {t("downloadFile")}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
