"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Star,
  FileText,
  Clock,
  CheckCircle,
  Download,
  Gift,
  AlertTriangle,
  Trophy,
  Rocket,
  Send,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface MissionDetailModalProps {
  open: boolean
  onClose: () => void
  mission: {
    missionId: number
    title: string
    description: string
    points: number
    promise?: string
    punishment?: string
    deadline?: string
    status: string
    attachmentUrl?: string
    createdAt: string
  }
  submission?: {
    submissionId: number
    fileUrl: string
    submittedAt: string
    status: string
    feedback?: string
    score?: number
    reviewedAt?: string
  }
}

function getTimeRemaining(deadline: string) {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()

  if (diff < 0) {
    return { text: "Expired!", urgent: true, expired: true, progress: 100 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  let text = ""
  let urgent = false
  let progress = 0

  if (days > 0) {
    text = `${days} day${days > 1 ? "s" : ""} left`
    urgent = days <= 1
    progress = days <= 1 ? 70 : days <= 3 ? 40 : 20
  } else if (hours > 0) {
    text = `${hours} hour${hours > 1 ? "s" : ""} left`
    urgent = true
    progress = 85
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    text = `${minutes} minute${minutes > 1 ? "s" : ""} left`
    urgent = true
    progress = 95
  }

  return { text, urgent, expired: false, progress }
}

export function MissionDetailModal({ open, onClose, mission, submission }: MissionDetailModalProps) {
  const timeInfo = mission.deadline ? getTimeRemaining(mission.deadline) : null

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Assigned":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          badge: "bg-blue-500",
          icon: <Rocket className="w-5 h-5" />,
        }
      case "Processing":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          badge: "bg-orange-500",
          icon: <Clock className="w-5 h-5" />,
        }
      case "Submitted":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          badge: "bg-purple-500",
          icon: <Send className="w-5 h-5" />,
        }
      case "Completed":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          badge: "bg-green-500",
          icon: <CheckCircle2 className="w-5 h-5" />,
        }
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          badge: "bg-gray-500",
          icon: <FileText className="w-5 h-5" />,
        }
    }
  }

  const statusConfig = getStatusConfig(mission.status)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Mission Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`${statusConfig.bg} border-2 ${statusConfig.border} p-4 rounded-xl`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{mission.title}</h3>
              <Badge className={`${statusConfig.badge} text-white text-sm flex items-center gap-1`}>
                {statusConfig.icon}
                {mission.status}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 mb-4 leading-relaxed">{mission.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600 font-bold">Reward</span>
                </div>
                <p className="text-2xl font-black text-yellow-600">{mission.points}</p>
              </div>

              {mission.deadline && timeInfo && (
                <div
                  className={`rounded-lg p-3 border-2 ${timeInfo.expired || timeInfo.urgent ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-300" : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar
                      className={`w-5 h-5 ${timeInfo.expired || timeInfo.urgent ? "text-red-500" : "text-green-500"}`}
                    />
                    <span
                      className={`text-xs font-bold ${timeInfo.expired || timeInfo.urgent ? "text-red-600" : "text-green-600"}`}
                    >
                      {timeInfo.text}
                    </span>
                  </div>
                  <Progress
                    value={timeInfo.progress}
                    className={`h-2 ${timeInfo.expired || timeInfo.urgent ? "bg-red-100" : "bg-green-100"}`}
                  />
                </div>
              )}

              <div className="bg-white rounded-lg p-3 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-xs text-gray-600 font-bold">Created</span>
                </div>
                <p className="text-sm font-bold text-gray-700">{new Date(mission.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {(mission.promise || mission.punishment) && (
              <div className="space-y-2">
                {mission.promise && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 flex items-start gap-2 shadow-sm">
                    <Gift className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-700 mb-1">🎁 Special Reward</p>
                      <p className="text-sm text-green-800 font-medium">{mission.promise}</p>
                    </div>
                  </div>
                )}

                {mission.punishment && (
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-2 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-700 mb-1">⚠️ Important Note</p>
                      <p className="text-sm text-red-800 font-medium">{mission.punishment}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mission.attachmentUrl && (
              <Button variant="outline" size="sm" className="w-full mt-3 bg-white border-2 font-bold" asChild>
                <a href={mission.attachmentUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />📎 Download Mission Files
                </a>
              </Button>
            )}
          </div>

          {submission && (
            <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Your Submission
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">Status</p>
                    <Badge
                      className={`${
                        submission.status === "Approved"
                          ? "bg-green-500"
                          : submission.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      } text-white text-sm`}
                    >
                      {submission.status}
                    </Badge>
                  </div>

                  <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 font-bold mb-1">Submitted</p>
                    <p className="text-sm font-bold text-gray-700">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {submission.score !== undefined && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-300">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5 text-green-600" />
                        <p className="text-xs text-green-700 font-bold">Your Score</p>
                      </div>
                      <p className="text-2xl font-black text-green-700">{submission.score}/100</p>
                    </div>
                  )}

                  {submission.reviewedAt && (
                    <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                      <p className="text-xs text-gray-600 font-bold mb-1">Reviewed</p>
                      <p className="text-sm font-bold text-gray-700">
                        {new Date(submission.reviewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {submission.feedback && (
                  <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💬</span>
                      <p className="text-base font-black text-yellow-800">Message from Parents</p>
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-yellow-300">
                      <p className="text-sm text-gray-800 leading-relaxed font-medium">{submission.feedback}</p>
                    </div>
                  </div>
                )}

                {submission.fileUrl && (
                  <Button variant="outline" size="sm" className="w-full bg-white border-2 font-bold" asChild>
                    <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />📥 Download Your Submission
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
