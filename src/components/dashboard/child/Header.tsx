import LanguageSwitcher from "@/components/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { Star, Flame, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { NotificationDropdown } from "./NotificationDropdown"
import { NotificationResponse } from "@/data/notification"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface HeaderProps {
  activeScreen: string
  player: {
    coins: number
    gems: number
    streak: number
  }
  points: number
  streak: number
  notifications: NotificationResponse[]
  onMarkNotificationAsRead: (id: number) => void
  onMarkAllNotificationsAsRead: () => void
}

export function Header({ 
  activeScreen, 
  player, 
  points,
  streak,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
}: HeaderProps) {
  const t = useTranslations("childDashboard.header")
  const { logout } = useAuth()
  const getScreenTitle = () => {
    return t(activeScreen as any)
  }
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b-2 border-gray-200 shadow-lg z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getScreenTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
            <div className="flex items-center gap-1 text-yellow-600 font-bold">
              <Star className="w-5 h-5" />
              {points}
            </div>
            {/* <div className="flex items-center gap-1 text-purple-600 font-bold">💎 {player.gems}</div> */}
            <div className="flex items-center gap-1 text-orange-600 font-bold">
              <Flame className="w-5 h-5" />
              {streak}
            </div>
          </div>

          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
          />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </Button>
        </div>
      </div>
    </div>
  )
}
