"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { mockData } from "@/data/mockData"
import { useTranslations } from "next-intl"

export default function ShopScreen() {
  const t = useTranslations("childDashboard.shop")
  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <div className="text-6xl animate-bounce mb-2">🏪</div>
        <h2 className="text-3xl font-bold text-gray-800">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300">
            <span className="font-bold text-yellow-800 flex items-center gap-1">
              <Star className="w-5 h-5" />
              {mockData.player.coins} {t("coins")}
            </span>
          </div>
          <div className="bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-300">
            <span className="font-bold text-purple-800 flex items-center gap-1">💎 {mockData.player.gems} {t("gems")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockData.powerUps.map((item) => (
          <Card
            key={item.id}
            className={`border-2 hover:shadow-lg transition-all transform hover:scale-105 ${
              item.rarity === "legendary"
                ? "bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-400"
                : item.rarity === "epic"
                  ? "bg-gradient-to-br from-purple-50 to-pink-100 border-purple-400"
                  : item.rarity === "rare"
                    ? "bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-400"
                    : item.rarity === "uncommon"
                      ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-400"
                      : "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-400"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2 animate-pulse">{item.icon}</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{item.name}</h3>
              <Badge
                variant="outline"
                className={`text-xs mb-2 ${
                  item.rarity === "legendary"
                    ? "border-yellow-500 text-yellow-700"
                    : item.rarity === "epic"
                      ? "border-purple-500 text-purple-700"
                      : item.rarity === "rare"
                        ? "border-blue-500 text-blue-700"
                        : item.rarity === "uncommon"
                          ? "border-green-500 text-green-700"
                          : "border-gray-500 text-gray-700"
                }`}
              >
                {item.rarity}
              </Badge>
              <div className="flex items-center justify-center gap-1 mb-2 text-yellow-600 font-bold">
                <Star className="w-4 h-4" />
                {item.cost}
              </div>
              <p className="text-xs text-gray-500 mb-2">{t("stock")}: {item.available}</p>
              <Button
                size="sm"
                className="w-full text-xs"
                disabled={mockData.player.coins < item.cost || item.available === 0}
              >
                {mockData.player.coins < item.cost
                  ? t("needMore")
                  : item.available === 0
                    ? t("soldOut")
                    : t("buyNow")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}