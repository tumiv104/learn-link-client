"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Star, Trophy, AlertCircle, Clock, Rocket, Send, CheckCircle2 } from "lucide-react"
import { MissionSubmission } from "@/data/mission"
import { useTranslations } from "next-intl"

interface MissionStatusCardProps {
  mission: MissionSubmission
  onViewDetail: () => void
  onStart?: () => void
  onSubmit?: () => void
}

function getTimeRemaining(deadline: string, createdAt: string, t: ReturnType<typeof useTranslations>, submittedAt?: string) {
  const start = new Date(createdAt);
  const end = new Date(deadline);
  let now: Date
  if (submittedAt !== undefined) {
    now = new Date(submittedAt)
  } else {
    now = new Date()
  }
  const diff = end.getTime() - now.getTime()
  const progress = Math.floor(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)
  if (diff < 0) {
    if (submittedAt === undefined)
      return { text: t("time.expired"), urgent: true, expired: true, progress: 100 }
    return getDiff(Math.abs(diff), true, "Late", t, progress)
  } else {
    if (submittedAt === undefined)
      return getDiff(diff, false, "Left", t, progress)
    return getDiff(diff, false, "Early", t, progress)
  }
  
}

function getDiff(diff: number, late: boolean, txt: string, t: ReturnType<typeof useTranslations>, process: number) {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  let text = ""
  let urgent = false

  if (days > 0) {
    text = t(`time.days${txt}`, { count: days })
    urgent = days <= 1
  } else if (hours > 0) {
    text = t(`time.hours${txt}`, { count: hours })
    urgent = true
  } else {
    text = t(`time.minutes${txt}`, { count: minutes })
    urgent = true
  }
  if (process > 100) process = 100

  return { text, urgent, expired: late, progress: process }
}

export function MissionStatusCard({ mission, onViewDetail, onStart, onSubmit }: MissionStatusCardProps) {
  const t = useTranslations("childDashboard.missions")

  let submittedTime = undefined
  if (mission.submission) {
    submittedTime = mission.submission.submittedAt ? mission.submission.submittedAt : undefined;
  }
  const timeInfo = mission.deadline ? getTimeRemaining(mission.deadline, mission.createdAt, t, submittedTime) : null

  const getStatusConfig = () => {
    switch (mission.missionStatus) {
      case "Assigned":
        return {
          color: "bg-blue-500",
          lightBg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <Rocket className="w-5 h-5" />,
          label: t("status.new"),
        }
      case "Processing":
        return {
          color: "bg-orange-500",
          lightBg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          icon: <Clock className="w-5 h-5 animate-pulse" />,
          label: t("status.processing"),
        }
      case "Submitted":
        return {
          color: "bg-purple-500",
          lightBg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          icon: <Send className="w-5 h-5" />,
          label: t("status.submitted"),
        }
      case "Completed":
        return {
          color: "bg-green-500",
          lightBg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: <CheckCircle2 className="w-5 h-5" />,
          label: t("status.completed"),
        }
      default:
        return {
          color: "bg-gray-500",
          lightBg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: <Star className="w-5 h-5" />,
          label: t("status.default"),
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Card className={`border-2 ${config.border} hover:shadow-lg transition-all bg-white`}>
      <div className={`${config.color} px-4 py-5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="text-white">{config.icon}</div>
          <h3 className="text-lg font-bold text-white">{mission.title}</h3>
        </div>
        <Badge className="bg-white/20 text-white border-0 text-base flex items-center gap-1">
          {config.icon}
          {config.label}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{mission.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className={`${config.lightBg} ${config.border} border rounded-lg p-2.5 flex items-center gap-2`}>
            <Star className={`w-5 h-5 ${config.text} fill-current`} />
            <div>
              <p className="text-xs text-gray-500 font-medium">{t("reward")}</p>
              <p className={`text-xl font-bold ${config.text}`}>{mission.points}</p>
            </div>
          </div>

          {mission.deadline && timeInfo && (
            <div
              className={`${timeInfo.expired || timeInfo.urgent ? "bg-red-50 border-red-300" : "bg-green-50 border-green-200"} border-2 rounded-lg p-2.5`}
            >
              <div className="flex items-center gap-2 mb-1">
                {timeInfo.expired || timeInfo.urgent ? (
                  <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                ) : (
                  <Calendar className="w-5 h-5 text-green-600" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-xs font-bold ${timeInfo.expired || timeInfo.urgent ? "text-red-600" : "text-green-600"}`}
                  >
                    {timeInfo.text}
                  </p>
                </div>
              </div>
              <Progress
                value={timeInfo.progress}
                className={`h-1.5 ${timeInfo.expired || timeInfo.urgent ? "bg-red-100" : "bg-green-100"}`}
              />
            </div>
          )}
        </div>

        {mission.missionStatus === "Completed" && (
          <div className="space-y-2">
            {mission.submission !== null && mission.submission.score !== undefined && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-green-700">{t("scoreTitle")}</span>
                </div>
                <span className="text-2xl font-black text-green-700">{mission.submission.score}/100</span>
              </div>
            )}
            {mission.submission !== null && mission.submission.feedback && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💬</span>
                  <p className="text-sm font-bold text-yellow-800">{t("feedbackTitle")}</p>
                  <span className="text-xl">❤️</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">{mission.submission.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            onClick={onViewDetail}
            size="lg"
            className="flex-1 text-lg font-bold border-2 hover:bg-gray-50 bg-white"
          >
            👁️ {t("buttons.viewDetail")}
          </Button>

          {mission.missionStatus === "Assigned" && onStart && (
            <Button
              onClick={onStart}
              size="lg"
              className={`flex-1 text-lg font-bold ${config.color} hover:opacity-90 shadow-md hover:shadow-lg transition-all text-white`}
            >
              🚀 {t("buttons.startNow")}
            </Button>
          )}

          {mission.missionStatus === "Processing" && onSubmit && (
            <Button
              onClick={onSubmit}
              size="lg"
              className={`flex-1 text-lg font-bold ${config.color} hover:opacity-90 shadow-md hover:shadow-lg transition-all text-white animate-pulse`}
            >
              📤 {t("buttons.submitWork")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
