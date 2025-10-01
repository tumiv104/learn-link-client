"use client"

import { Mission } from "@/data/mission"
import { Calendar, Clock, Star, User, File, Link, NotepadText } from "lucide-react"

interface MissionViewProps {
  mission: Mission
}

export function MissionView({ mission }: MissionViewProps) {
  const getStatusColor = (status: Mission["Status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Assigned":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

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
            <span className="text-sm font-medium text-slate-600">Description:</span>
            <p className="font-semibold text-slate-800 text-lg">{mission.Description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Assigned to:</span>
            <p className="font-semibold text-slate-800 text-lg">{mission.ChildName}</p>
        </div>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Created:</span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            {mission.CreatedAt ? new Date(mission.CreatedAt).toLocaleDateString() : "N/A"}
            </p>
        </div>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Total Reward:</span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-lg">{mission.Points} points</span>
            </p>
        </div>
        <div className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Deadline:</span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            {new Date(mission.Deadline).toLocaleDateString()}
            </p>
        </div>
        {mission.AttachmentUrl && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                {getFileTypeIcon(mission.AttachmentUrl)}
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Mission Attachment</p>
                  <a
                    href={mission.AttachmentUrl}
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
