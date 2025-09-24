'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Star,
  Trophy,
  Target,
  Crown,
  Flame,
  MessageCircle,
  Calendar,
  TrendingUp,
  Clock,
  Gift,
  Zap
} from "lucide-react"
import { mockData } from "@/data/mockData"
import { UserDto } from "@/services/auth/authService"
import { ProgressBar } from "@/components/dashboard/ProgressBar"
import { QuestCard } from "@/components/dashboard/child/QuestCard"
import { MissionCard } from "@/components/dashboard/child/MissionCard"
import { useTranslations } from "next-intl"

interface UserProps {
  user: UserDto | null
}

export default function HomeScreen(user : UserProps) {
  const t = useTranslations("childDashboard.childHome");
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10 animate-pulse">⭐</div>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-8xl animate-bounce">{mockData.player.avatar}</div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{t("welcome.greeting")} {user.user?.name}! 🎉</h1>
            <p className="text-xl text-purple-100 mb-2">{mockData.player.title}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-300" />
                <span className="text-xl font-bold">{t("welcome.level", { level: mockData.player.level })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-300" />
                <span className="text-xl font-bold">{t("welcome.streak", { days: mockData.player.streak })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center bg-white/20 rounded-2xl p-4">
            <div className="text-3xl font-bold">{mockData.player.coins}</div>
            <div className="text-sm text-purple-100 flex items-center justify-center gap-1">
              <Star className="w-4 h-4" /> {t("welcome.coins")}
            </div>
          </div>
          <div className="text-center bg-white/20 rounded-2xl p-4">
            <div className="text-3xl font-bold">{mockData.player.gems}</div>
            <div className="text-sm text-purple-100 flex items-center justify-center gap-1">💎 {t("welcome.gems")}</div>
          </div>
          <div className="text-center bg-white/20 rounded-2xl p-4">
            <div className="text-3xl font-bold">{mockData.player.energy}%</div>
            <div className="text-sm text-purple-100 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4" /> {t("welcome.energy")}
            </div>
          </div>
          <div className="text-center bg-white/20 rounded-2xl p-4">
            <div className="text-3xl font-bold">{mockData.player.totalMissionsCompleted}</div>
            <div className="text-sm text-purple-100">{t("welcome.totalMissions")}</div>
          </div>
        </div>

        <ProgressBar
          current={mockData.player.xp}
          total={mockData.player.nextLevelXp}
          label={t("welcome.progress")}
          className="text-white"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Daily Quests and Active Missions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-8 h-8 text-blue-500" />
              {t("sections.dailyQuests")}
            </h2>
            <div className="space-y-4">
              {mockData.dailyQuests.map((quest) => (
                <QuestCard key={quest.id} {...quest} />
              ))}
            </div>
          </div>

          {/* Active Missions */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-8 h-8 text-green-500" />
              {t("sections.activeMissions")}
            </h2>
            <div className="space-y-4">
              {mockData.missions
                .filter((m) => m.status === "active")
                .map((mission) => (
                  <MissionCard key={mission.id} {...mission} />
                ))}
            </div>
          </div>
        </div>

        {/* Right Column - Stats and Activities */}
        <div className="space-y-6">
          {/* Weekly Progress */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                {t("sections.weekly")}
              </h3>
              <div className="space-y-4">
                <ProgressBar
                  current={mockData.player.weeklyProgress}
                  total={mockData.player.weeklyGoal}
                  label={t("weekly.goal")}
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{mockData.weeklyStats.missionsCompleted}</div>
                    <div className="text-xs text-gray-600">{t("weekly.missionsDone")}</div>
                  </div>
                  <div className="text-center bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">{mockData.weeklyStats.coinsEarned}</div>
                    <div className="text-xs text-gray-600">{t("weekly.coinsEarned")}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                {t("sections.quickStats")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("quickStats.studyTime")}</span>
                  <span className="font-bold text-blue-600">{mockData.weeklyStats.studyTime}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("quickStats.favoriteCategory")}</span>
                  <span className="font-bold text-green-600">{mockData.player.favoriteCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("quickStats.achievementsEarned")}</span>
                  <span className="font-bold text-yellow-600">
                    {mockData.achievements.filter((a) => a.earned).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                {t("sections.recentActivities")}
              </h3>
              <div className="space-y-3">
                {mockData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                    <div className="text-lg">
                      {activity.type === "mission"
                        ? "🚀"
                        : activity.type === "achievement"
                          ? "🏆"
                          : activity.type === "purchase"
                            ? "🛒"
                            : "⭐"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="text-sm font-bold text-yellow-600">
                      {activity.reward ? `+${activity.reward}` : `-${activity.cost}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-green-500" />
                {t("sections.quickActions")}
              </h3>
              <div className="space-y-3">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t("quickActions.messageParents")}
                </Button>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 justify-start">
                  <Gift className="w-4 h-4 mr-2" />
                  {t("quickActions.visitShop")}
                </Button>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  {t("quickActions.viewAchievements")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}