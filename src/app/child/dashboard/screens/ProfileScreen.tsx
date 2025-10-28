"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockData } from "@/data/mockData"
import type { UserDto } from "@/services/auth/authService"
import { MessageCircle, Star, Trophy, User, Zap, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { ChangePasswordDialog } from "@/components/auth/ChangePasswordDialog"

interface ProfileScreenProps {
  user: UserDto | null
  onLogout: () => Promise<void>
  streak: number
  balance: number
}

export default function ProfileScreen({ user, onLogout, streak, balance }: ProfileScreenProps) {
  const t = useTranslations("childDashboard.profile")
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <div className="text-8xl mb-4">{mockData.player.avatar}</div>
        <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
        <p className="text-gray-600">{mockData.player.title}</p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge className="bg-orange-500">
            🔥 {streak} {t("days")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-300">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-800">{balance}</div>
            <p className="text-yellow-700">{t("coins")}</p>
          </CardContent>
        </Card>

        {/* <Card className="bg-gradient-to-br from-purple-100 to-pink-200 border-2 border-purple-300">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-2xl font-bold text-purple-800">{mockData.player.gems}</div>
            <p className="text-purple-700">{t("gems")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-cyan-200 border-2 border-blue-300">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-800">
              {mockData.achievements.filter((a) => a.earned).length}
            </div>
            <p className="text-blue-700">{t("achievements")}</p>
          </CardContent>
        </Card> */}

        <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-2 border-green-300">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-800">{mockData.player.energy}%</div>
            <p className="text-green-700">{t("energy")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button className="w-full bg-purple-500 hover:bg-purple-600 text-lg py-3">
          <User className="w-5 h-5 mr-2" />
          {t("editProfile")}
        </Button>
        <Button
          onClick={() => setChangePasswordOpen(true)}
          variant="outline"
          className="w-full text-lg py-3 bg-transparent"
        >
          <Lock className="w-5 h-5 mr-2" />
          {t("changePassword")}
        </Button>
        {/* <Button variant="outline" className="w-full text-lg py-3 bg-transparent">
          <MessageCircle className="w-5 h-5 mr-2" />
          {t("messageParents")}
        </Button> */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full text-lg py-3 text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
        >
          {t("logout")}
        </Button>
      </div>

      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  )
}
