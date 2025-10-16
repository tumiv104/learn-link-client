"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Calendar, Upload, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"
import type { UserProfileDTO } from "@/data/UserProfileDTO"

interface EditProfileDialogProps {
  open: boolean
  onClose: () => void
  profile: UserProfileDTO
  onSuccess: () => void
  onUpdateProfile: (formData: FormData) => Promise<void>
}

export function EditProfileDialog({ open, onClose, profile, onSuccess, onUpdateProfile }: EditProfileDialogProps) {
  const t = useTranslations("parentDashboard.profile")
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [formData, setFormData] = useState({
    name: profile.name,
    dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.avatarUrl ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${profile.avatarUrl}` : "/default-avatar.png",
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
      })
      setAvatarPreview(
        profile.avatarUrl ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatarUrl}` : "/default-avatar.png",
      )
    }
  }, [profile])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      showError("Validation Error", "Name is required")
      return
    }

    const fd = new FormData()
    fd.append("Name", formData.name)
    if (formData.dob) {
      fd.append("Dob", new Date(formData.dob).toISOString())
    }
    if (avatarFile) {
      fd.append("AvatarFile", avatarFile)
    }

    setLoading(true)
    try {
      await onUpdateProfile(fd)
      showSuccess("Success", "Profile updated successfully!")
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (error: any) {
      showError("Error", error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {alert && <AlertPopup type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            {t("editDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={avatarPreview || "/placeholder.svg"}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png"
                }}
              />
              <label
                htmlFor="avatar-upload-edit"
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Upload className="w-4 h-4 text-white" />
              </label>
              <input
                id="avatar-upload-edit"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">{t("editDialog.avatarHelp")}</p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email-readonly" className="text-base font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              {t("editDialog.emailLabel")}
            </Label>
            <Input
              id="email-readonly"
              value={profile.email}
              disabled
              className="text-base bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">{t("editDialog.emailHelp")}</p>
          </div>

          {/* Name (Editable) */}
          <div className="space-y-2">
            <Label htmlFor="name-edit" className="text-base font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              {t("editDialog.nameLabel")}
            </Label>
            <Input
              id="name-edit"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("editDialog.namePlaceholder")}
              className="text-base"
            />
          </div>

          {/* Date of Birth (Editable) */}
          <div className="space-y-2">
            <Label htmlFor="dob-edit" className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {t("editDialog.dobLabel")}
            </Label>
            <Input
              id="dob-edit"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              className="text-base"
            />
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <Label className="text-base font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              {t("editDialog.roleLabel")}
            </Label>
            <Input value={profile.roleName} disabled className="text-base bg-gray-100 cursor-not-allowed" />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t("editDialog.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
            {loading ? "Saving..." : t("editDialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
