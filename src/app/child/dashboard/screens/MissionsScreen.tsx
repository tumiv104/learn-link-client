'use client'

import { MissionCard } from "@/components/dashboard/child/MissionCard";
import { mockData } from "@/data/mockData";
import { useTranslations } from "next-intl";

export default function MissionScreen() {
  const t = useTranslations("childDashboard.missions")
  return (
    <div className="space-y-6 pb-24">
          <div className="text-center mb-6">
            <div className="text-6xl animate-bounce mb-2">⚔️</div>
            <h2 className="text-3xl font-bold text-gray-800">{t("title")}</h2>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
    
          <div className="grid gap-4">
            {mockData.missions.map((mission) => (
              <MissionCard key={mission.id} {...mission} />
            ))}
          </div>
        </div>
  )
}