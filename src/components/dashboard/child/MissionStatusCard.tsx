"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Star, Trophy, AlertCircle, Clock, Rocket, Send, CheckCircle2 } from "lucide-react"

interface MissionStatusCardProps {
  mission: {
    missionId: number
    title: string
    description: string
    points: number
    deadline?: string
    status: string
    attachmentUrl?: string
    score?: number
    feedback?: string
  }
  onViewDetail: () => void
  onStart?: () => void
  onSubmit?: () => void
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
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

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
    text = `${minutes} minute${minutes > 1 ? "s" : ""} left`
    urgent = true
    progress = 95
  }

  return { text, urgent, expired: false, progress }
}

export function MissionStatusCard({ mission, onViewDetail, onStart, onSubmit }: MissionStatusCardProps) {
  const timeInfo = mission.deadline ? getTimeRemaining(mission.deadline) : null

  const getStatusConfig = () => {
    switch (mission.status) {
      case "Assigned":
        return {
          color: "bg-blue-500",
          lightBg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <Rocket className="w-5 h-5" />,
          label: "New Mission",
        }
      case "Processing":
        return {
          color: "bg-orange-500",
          lightBg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          icon: <Clock className="w-5 h-5 animate-pulse" />,
          label: "In Progress",
        }
      case "Submitted":
        return {
          color: "bg-purple-500",
          lightBg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          icon: <Send className="w-5 h-5" />,
          label: "Submitted",
        }
      case "Completed":
        return {
          color: "bg-green-500",
          lightBg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: <CheckCircle2 className="w-5 h-5" />,
          label: "Completed",
        }
      default:
        return {
          color: "bg-gray-500",
          lightBg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: <Star className="w-5 h-5" />,
          label: "Mission",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Card className={`border-2 ${config.border} hover:shadow-lg transition-all bg-white`}>
      <div className={`${config.color} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="text-white">{config.icon}</div>
          <h3 className="text-base font-bold text-white">{mission.title}</h3>
        </div>
        <Badge className="bg-white/20 text-white border-0 text-xs flex items-center gap-1">
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
              <p className="text-xs text-gray-500 font-medium">Reward</p>
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

        {mission.status === "Completed" && (
          <div className="space-y-2">
            {mission.score !== undefined && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-green-700">Your Score</span>
                </div>
                <span className="text-2xl font-black text-green-700">{mission.score}/100</span>
              </div>
            )}
            {mission.feedback && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💬</span>
                  <p className="text-sm font-bold text-yellow-800">Message from Parents</p>
                  <span className="text-xl">❤️</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">{mission.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            onClick={onViewDetail}
            size="sm"
            className="flex-1 text-sm font-bold border-2 hover:bg-gray-50 bg-white"
          >
            👁️ View Details
          </Button>

          {mission.status === "Assigned" && onStart && (
            <Button
              onClick={onStart}
              size="sm"
              className={`flex-1 text-sm font-bold ${config.color} hover:opacity-90 shadow-md hover:shadow-lg transition-all text-white`}
            >
              🚀 Start Now!
            </Button>
          )}

          {mission.status === "Processing" && onSubmit && (
            <Button
              onClick={onSubmit}
              size="sm"
              className={`flex-1 text-sm font-bold ${config.color} hover:opacity-90 shadow-md hover:shadow-lg transition-all text-white animate-pulse`}
            >
              📤 Submit Work
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
