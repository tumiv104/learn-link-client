"use client"

import { Home, Gamepad2, ShoppingBag, Award, User, Crown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SidebarProps {
  activeScreen: string
  setActiveScreen: (screen: string) => void
  name?: string
  player: {
    avatar: string
    title: string
    level: number
    xp: number
    nextLevelXp: number
  }
}

export function Sidebar({ activeScreen, setActiveScreen, name, player }: SidebarProps) {
  const navigationItems = [
    { id: "home", icon: Home, label: "Dashboard", color: "hover:bg-purple-500" },
    { id: "missions", icon: Gamepad2, label: "Missions", color: "hover:bg-green-500" },
    { id: "shop", icon: ShoppingBag, label: "Shop", color: "hover:bg-blue-500" },
    { id: "achievements", icon: Award, label: "Achievements", color: "hover:bg-yellow-500" },
    { id: "profile", icon: User, label: "Profile", color: "hover:bg-pink-500" },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-600 to-pink-600 text-white shadow-2xl z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-4xl">{player.avatar}</div>
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-purple-200 text-sm">{player.title}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                activeScreen === item.id
                  ? "bg-white/20 shadow-lg transform scale-105"
                  : `${item.color} hover:transform hover:scale-105`
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-300" />
            <span className="font-bold">Level {player.level}</span>
          </div>
          <Progress value={(player.xp / player.nextLevelXp) * 100} className="h-2 bg-white/20" />
          <div className="text-xs text-purple-200 mt-1">
            {player.xp}/{player.nextLevelXp} XP
          </div>
        </div>
      </div>
    </div>
  )
}
