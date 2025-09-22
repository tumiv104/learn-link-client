import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Star, Award } from "lucide-react"

interface Mission {
  MissionId: number
  Title: string
  Description: string
  ChildName: string
  Status: string
  Points: number
  BonusPoints?: number | null
  Deadline: string
  Promise?: string | null
}

interface MissionManagementCardProps {
  mission: Mission
}

export function MissionManagementCard({ mission }: MissionManagementCardProps) {
  const getStatusVariant = () => {
    switch (mission.Status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{mission.Title}</h3>
            <p className="text-gray-600 mb-2">{mission.Description}</p>
            <p className="text-sm text-gray-500 mb-2">Assigned to: {mission.ChildName}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={getStatusVariant()}>{mission.Status}</Badge>
              <span className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due: {mission.Deadline}
              </span>
              <span className="text-sm font-medium text-amber-600">
                <Star className="w-4 h-4 inline mr-1" />
                {mission.Points} points
                {mission.BonusPoints && ` (+${mission.BonusPoints} bonus)`}
              </span>
            </div>
            {mission.Promise && (
              <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-700">
                <Award className="w-4 h-4 inline mr-1" />
                Promise: {mission.Promise}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
