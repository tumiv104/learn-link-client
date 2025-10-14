"use client"

import { Mission } from "@/data/mission"
import { formatDateTime } from "@/utils/formatDateTime"
import { Calendar, Clock, Star, File, Link, NotepadText } from "lucide-react"
import { useTranslations } from "next-intl"

interface MissionViewProps {
  mission: Mission
  locale: string
}

export function MissionView({ mission, locale }: MissionViewProps) {
  const t = useTranslations("parentDashboard.missions")

  const getFileTypeIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <File className="w-4 h-4 text-red-500" />
      case "doc":
      case "docx":
        return <File className="w-4 h-4 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <File className="w-4 h-4 text-green-500" />
      case "zip":
      case "rar":
        return <File className="w-4 h-4 text-purple-500" />
      default:
        return <Link className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <div className="grid gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h4 className="font-bold text-lg flex items-center gap-3 text-slate-800">
        <div className="p-2 rounded-lg bg-blue-100">
            <NotepadText className="w-5 h-5 text-blue-600" />
        </div>
        {mission.Title}
        </h4>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">{t("description")}:</span>
            <p className="font-semibold text-slate-800 text-lg">{mission.Description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">{t("assignedTo")}:</span>
            <p className="font-semibold text-slate-800 text-lg">{mission.ChildName}</p>
        </div>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">{t("created")}:</span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            {mission.CreatedAt ? formatDateTime(mission.CreatedAt, locale) : "N/A"}
            </p>
        </div>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">{t("totalReward")}:</span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-lg">{mission.Points} {t("points")}</span>
            </p>
        </div>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">{t("deadline")}:</span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            {formatDateTime(mission.Deadline, locale)}
            </p>
        </div>
        {mission.AttachmentUrl && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                {getFileTypeIcon(mission.AttachmentUrl)}
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{t("attachment")}</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}${mission.AttachmentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                    
                  >
                    {mission.AttachmentUrl}
                  </a>
                </div>
              </div>
            )}
        </div>
    </div>
  )
}
