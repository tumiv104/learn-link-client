import { Bell, CheckCircle, Gift, FileText } from "lucide-react"

interface NotificationItemProps {
  message: string
  time: string
  type: "completion" | "reward" | "submission"
  isRead?: boolean
}

export function NotificationItem({ message, time, type, isRead = true }: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case "completion":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "reward":
        return <Gift className="w-4 h-4 text-amber-500" />
      case "submission":
        return <FileText className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "completion":
        return "bg-green-50"
      case "reward":
        return "bg-amber-50"
      case "submission":
        return "bg-blue-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div className={`flex items-start gap-3 p-3 ${getBgColor()} rounded-lg`}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      {!isRead && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
    </div>
  )
}
