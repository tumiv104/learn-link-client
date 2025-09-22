import { Button } from "@/components/ui/button"
import { Star, Flame, Bell, Settings } from "lucide-react"

interface HeaderProps {
  activeScreen: string
  player: {
    coins: number
    gems: number
    streak: number
  }
}

export function Header({ activeScreen, player }: HeaderProps) {
  const getScreenTitle = () => {
    switch (activeScreen) {
      case "home":
        return "🏠 Dashboard"
      case "missions":
        return "🚀 Mission Control"
      case "shop":
        return "🏪 Power-Up Shop"
      case "achievements":
        return "🏆 Trophy Collection"
      case "profile":
        return "👤 My Profile"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b-2 border-gray-200 shadow-lg z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getScreenTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
            <div className="flex items-center gap-1 text-yellow-600 font-bold">
              <Star className="w-5 h-5" />
              {player.coins}
            </div>
            <div className="flex items-center gap-1 text-purple-600 font-bold">💎 {player.gems}</div>
            <div className="flex items-center gap-1 text-orange-600 font-bold">
              <Flame className="w-5 h-5" />
              {player.streak}
            </div>
          </div>

          <Button variant="outline" size="sm" className="bg-transparent">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
