import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { ProgressBar } from "../ProgressBar"

interface QuestCardProps {
  title: string
  description: string
  progress: number
  total: number
  reward: number
  type: "coins" | "gems"
  icon: string
  difficulty: "easy" | "medium" | "hard"
}

export function QuestCard({ title, description, progress, total, reward, type, icon, difficulty }: QuestCardProps) {
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
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-pulse">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600 mb-3">{description}</p>
            <ProgressBar current={progress} total={total} className="mb-2" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 flex items-center gap-1 mb-2">
              {type === "coins" ? <Star className="w-6 h-6" /> : "💎"}
              {reward}
            </div>
            <Badge variant={getDifficultyVariant()}>{difficulty}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
