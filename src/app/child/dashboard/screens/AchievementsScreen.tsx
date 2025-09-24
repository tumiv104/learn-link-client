'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockData } from "@/data/mockData";
import { Crown, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AchievementScreen() {
  const t = useTranslations("childDashboard.achievements")
    return (
        <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <div className="text-6xl animate-pulse mb-2">🏆</div>
        <h2 className="text-3xl font-bold text-gray-800">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockData.achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`border-2 transition-all transform hover:scale-105 ${
              achievement.earned
                ? `bg-gradient-to-br ${
                    achievement.rarity === "legendary"
                      ? "from-yellow-100 to-orange-200 border-yellow-400"
                      : achievement.rarity === "epic"
                        ? "from-purple-100 to-pink-200 border-purple-400"
                        : achievement.rarity === "rare"
                          ? "from-blue-100 to-cyan-200 border-blue-400"
                          : achievement.rarity === "uncommon"
                            ? "from-green-100 to-emerald-200 border-green-400"
                            : "from-gray-100 to-slate-200 border-gray-400"
                  } shadow-lg`
                : "from-gray-50 to-gray-100 border-gray-300 opacity-60"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className={`text-4xl mb-2 ${achievement.earned ? "animate-bounce" : "grayscale"}`}>
                {achievement.icon}
              </div>
              <h3 className={`font-bold text-sm mb-1 ${achievement.earned ? "text-gray-800" : "text-gray-500"}`}>
                {achievement.name}
              </h3>
              <Badge
                variant="outline"
                className={`text-xs mb-2 ${
                  achievement.earned
                    ? achievement.rarity === "legendary"
                      ? "border-yellow-500 text-yellow-700"
                      : achievement.rarity === "epic"
                        ? "border-purple-500 text-purple-700"
                        : achievement.rarity === "rare"
                          ? "border-blue-500 text-blue-700"
                          : achievement.rarity === "uncommon"
                            ? "border-green-500 text-green-700"
                            : "border-gray-400 text-gray-500"
                    : "border-gray-400 text-gray-500"
                }`}
              >
                {achievement.rarity}
              </Badge>

              {achievement.earned ? (
                <Badge className="bg-green-500 text-white text-xs">{t("unlocked")}</Badge>
              ) : (
                <div className="space-y-1">
                  <Progress value={((achievement.progress ?? 0) / (achievement.total ?? 1)) * 100} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {achievement.progress}/{achievement.total}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          {t("leaderboard")}
        </h3>
        <div className="space-y-2">
          {mockData.leaderboard.map((player) => (
            <Card
              key={player.rank}
              className={`${player.isMe ? "bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300" : "bg-white"}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      player.rank === 1
                        ? "bg-yellow-500"
                        : player.rank === 2
                          ? "bg-gray-400"
                          : player.rank === 3
                            ? "bg-orange-600"
                            : "bg-gray-500"
                    }`}
                  >
                    {player.rank}
                  </div>
                  <div className="text-2xl">{player.avatar}</div>
                  <div className="flex-1">
                    <p className={`font-bold ${player.isMe ? "text-purple-800" : "text-gray-800"}`}>
                      {player.name} {player.isMe && t("you")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {player.points}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    )
}