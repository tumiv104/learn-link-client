"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationResponse } from "@/data/notification"
import { useTranslations } from "next-intl"

interface NotificationDropdownProps {
  notifications: NotificationResponse[]
  onMarkAsRead: (id: number) => void
  onMarkAllAsRead: () => void
}

function renderMessage(notification: NotificationResponse, t: (key: string, values?: any) => string) {
  const { type, payload } = notification

  switch (type) {
    case "MissionAssigned":
      return t("message.missionAssigned", { title: payload.title })
    case "MissionReviewed":
      return t("message.missionReviewed", { title: payload.title })
    case "MissionStarted":
      return t("message.missionStarted", { childName: payload.childName, title: payload.title })
    case "MissionSubmitted":
      return t("message.missionSubmitted", { childName: payload.childName, title: payload.title })
    default:
      return payload.title
  }
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const t = useTranslations("NotificationDropdown")
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: NotificationResponse["type"]) => {
    switch (type) {
      case "MissionAssigned":
        return "🚀"
      case "MissionReviewed":
        return "🏆"
      default:
        return "📢"
    }
  }

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t("time.justNow")
    if (minutes < 60) return t("time.minutesAgo", { count: minutes })
    if (hours < 24) return t("time.hoursAgo", { count: hours })
    return t("time.daysAgo", { count: days })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-bold text-sm">{t("title")}</h3>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="h-7 text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  {t("markAllRead")}
                </Button>
              )}
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">{t("noNotifications")}</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.notificationId}
                className={`p-3 cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""}`}
                onClick={() => onMarkAsRead(notification.notificationId)}
              >
                <div className="flex gap-3 w-full">
                  <div className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm">{notification.payload.title}</p>
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{renderMessage(notification, t)}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimestamp(notification.createdAt)}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
