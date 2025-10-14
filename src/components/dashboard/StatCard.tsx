import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  gradient?: string
  textColor?: string
}

export function StatCard({ title, value, description, icon: Icon, gradient, textColor = "text-white" }: StatCardProps) {
  return (
    <Card className={`${gradient || "bg-gradient-to-br from-blue-500 to-blue-600"} ${textColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-sm opacity-80">{description}</p>}
      </CardContent>
    </Card>
  )
}
