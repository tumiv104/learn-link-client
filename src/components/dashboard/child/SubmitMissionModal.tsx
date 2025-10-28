"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { MissionSubmission } from "@/data/mission"
import { useTranslations } from "next-intl"

interface SubmitMissionModalProps {
  open: boolean
  onClose: () => void
  mission: MissionSubmission
  onSubmit: (missionId: number, file?: File | null) => Promise<void>
}

export function SubmitMissionModal({ open, onClose, mission, onSubmit }: SubmitMissionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations("childDashboard.submitMissionModal")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(mission.missionId, selectedFile)
      setSelectedFile(null)
      onClose()
    } catch (error) {
      console.error("Failed to submit mission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold">{t("missionLabel")}:</span> {mission.title}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-base font-semibold">
              {t("uploadLabel")}
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
              accept="image/*,.pdf,.doc,.docx,.zip"
            />
            {!selectedFile && (
              <p className="text-sm text-gray-500 italic">{t("noFile")}</p>
            )}
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">{selectedFile.name}</span>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <span className="font-bold">Note:</span> {t("note")}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-500 hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : t("confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
