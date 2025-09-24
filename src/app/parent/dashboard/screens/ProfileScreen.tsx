'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { useTranslations } from "next-intl"

export default function ProfileScreen() {
    const t = useTranslations("parentDashboard.profile")
    return (
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                {t("title")}
                </CardTitle>
                <CardDescription>{t("desc")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">{t("settingsTitle")}</h3>
                <p className="text-gray-500">{t("settingsDesc")}</p>
                </div>
            </CardContent>
            </Card>
      </div>
    )
}