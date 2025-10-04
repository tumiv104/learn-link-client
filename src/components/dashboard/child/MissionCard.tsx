import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, Camera, Trophy, Gamepad2, Heart, Sparkles } from "lucide-react"
import { ProgressBar } from "../ProgressBar"
import { useTranslations } from "next-intl"
import { MissionResponse } from "@/services/mission/missionService"

interface MissionCardProps {
  id: number
  title: string
  description: string
  status: string
  progress: number
  total: number
  reward: number
  deadline?: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  bonus?: string
  feedback?: string
}

export function MissionCard({
  id,
  title,
  description,
  status,
  progress,
  total,
  reward,
  deadline,
  category,
  difficulty,
  bonus,
  feedback,
}: MissionCardProps) {
  const t = useTranslations("childDashboard.missions")

  const getCardStyle = () => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
      case "Submitted":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300"
      default:
        return "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
    }
  }

  const getCategoryIcon = () => {
    switch (category) {
      case "study":
        return "📚"
      case "chores":
        return "🏠"
      default:
        return "⭐"
    }
  }

  const getDifficultyVariant = () => {
    switch (difficulty) {
      case "easy":
        return "secondary"
      case "medium":
        return "default"
      case "hard":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className={`border-2 hover:shadow-xl transition-all transform hover:scale-[1.02] ${getCardStyle()}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">{getCategoryIcon()}</div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              {status === "completed" && <div className="text-2xl animate-bounce">🎉</div>}
            </div>
            <p className="text-gray-600 mb-3">{description}</p>

            {status !== "completed" && <ProgressBar current={progress} total={total} className="mb-3" />}

            {bonus && (
              <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-2 mb-3">
                <p className="text-yellow-800 text-sm font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {bonus}
                </p>
              </div>
            )}

            {feedback && (
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 mb-3">
                <p className="text-green-800 font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {t("feedback")}
                </p>
                <p className="text-green-700">{feedback}</p>
              </div>
            )}
          </div>

          <div className="text-center ml-4">
            <div className="text-2xl font-bold text-yellow-600 mb-2 flex items-center gap-1">
              <Star className="w-6 h-6" />
              {reward}
            </div>
            <Badge variant={getDifficultyVariant()}>{t(`difficulty.${difficulty}`)}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          {status === "new" && (
            <Button className="bg-purple-500 hover:bg-purple-600 flex-1">
              <Gamepad2 className="w-4 h-4 mr-2" />
              {t("actions.start")}
            </Button>
          )}
          {status === "active" && (
            <>
              <Button className="bg-green-500 hover:bg-green-600 flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("actions.complete")}
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Camera className="w-4 h-4 mr-2" />
                {t("actions.addPhoto")}
              </Button>
            </>
          )}
          {status === "completed" && (
            <Button disabled className="bg-green-500 flex-1">
              <Trophy className="w-4 h-4 mr-2" />
              {t("actions.completed")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
