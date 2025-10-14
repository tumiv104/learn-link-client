import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { ProgressBar } from "../ProgressBar"
import { useTranslations } from "next-intl"

export interface QuestCardProps {
  title: string
  description?: string
  points: number
  status: string
  deadline?: string
}

export function QuestCard({ title, description, points, status, deadline }: QuestCardProps) {
  const t = useTranslations("childDashboard.missions")

  const getStatusVariant = () => {
    switch (status) {
      case "Assigned":
        return "secondary"
      case "Processing":
        return "default"
      case "Completed":
        return "destructive"
      case "Reviewed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDeadline = (date?: string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString()
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {description && <p className="text-gray-600 mb-2">{description}</p>}

            {/* Nếu muốn hiển thị progress bar cho mission đang làm */}
            {status === "Processing" && (
              <ProgressBar current={50} total={100} className="mb-2" /> // TODO: thay progress thực tế
            )}

            {deadline && (
              <p className="text-xs text-gray-500">
                {t("deadline")}: {formatDeadline(deadline)}
              </p>
            )}
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-600 flex items-center gap-1 mb-2">
              <Star className="w-5 h-5" />
              {points}
            </div>
            <Badge variant={getStatusVariant()}>{t(`tabs.${status.toLocaleLowerCase()}`)}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
