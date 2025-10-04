import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Star, Award } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Mission } from "@/data/mission"
import { formatDateTime } from "@/utils/formatDateTime"

interface MissionManagementCardProps {
  mission: Mission
  onOpenDialog: (mode: "view" | "edit", mission: any) => void
  locale: string
}

export function MissionManagementCard({ mission, onOpenDialog, locale }: MissionManagementCardProps) {
  const t = useTranslations("parentDashboard.missions")
  const getStatusVariant = () => {
    switch (mission.Status) {
      case "Completed":
        return "outline"
      case "Submitted":
        return "destructive"
      case "Processing":
        return "secondary"
      default:
        return "default"
    }
  }
  const [missionDialog, setMissionDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit" | "view",
    mission: undefined as any,
  })

  return (
    <Card className="hover:shadow-lg transition-shadow">
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{mission.Title}</h3>
            <p className="text-gray-600 mb-2">{mission.Description}</p>
            <p className="text-sm text-gray-500 mb-2">{t("assignedTo")}: {mission.ChildName}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={getStatusVariant()}>{t(`missionStatus.${mission.Status}`)}</Badge>
              <span className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t("due")}: {formatDateTime(mission.Deadline, locale)}
              </span>
              <span className="text-sm font-medium text-amber-600">
                <Star className="w-4 h-4 inline mr-1" />
                {mission.Points} {t("points")}
              </span>
            </div>
            {mission.Promise && (
              <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-700">
                <Award className="w-4 h-4 inline mr-1" />
                {t("promise")}: {mission.Promise}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {mission.Status == "Assigned" && 
              <Button variant="outline" size="sm" onClick={() => onOpenDialog("edit", mission)}>
                {t("edit")}
              </Button>
            }
            <Button variant="outline" size="sm" onClick={() => onOpenDialog("view", mission)}>
              {t("view")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
