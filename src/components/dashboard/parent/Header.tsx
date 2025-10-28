"use client"

import { Button } from "@/components/ui/button"
import { Star, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

import { useTranslations } from "next-intl"
import type { NotificationResponse } from "@/data/notification"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { NotificationDropdown } from "../child/NotificationDropdown"

interface HeaderProps {
  notifications: NotificationResponse[]
  onMarkNotificationAsRead: (id: number) => void
  onMarkAllNotificationsAsRead: () => void
}

export default function Header({ notifications, onMarkNotificationAsRead, onMarkAllNotificationsAsRead }: HeaderProps) {
  const t = useTranslations("header")
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
          onClickCapture={(e) => {
            // Prevent navigation if clicking on notification dropdown
            if ((e.target as HTMLElement).closest('[role="button"]')) {
              e.stopPropagation()
            }
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Learn Link
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {t("welcome")}, {user?.name}!
              </span>
              <NotificationDropdown
                notifications={notifications}
                onMarkAsRead={onMarkNotificationAsRead}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
              />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                {t("login")}
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => router.push("/auth/register")}
              >
                {t("signup")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
