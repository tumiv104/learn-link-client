"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Mail, Lock, Calendar, Upload, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"

interface CreateChildDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  onCreateChild: (formData: FormData) => Promise<void>
}

export default function CreateChildDialog({ open, onClose, onSuccess, onCreateChild }: CreateChildDialogProps) {
  const t = useTranslations("parentDashboard.overview.children")
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("/default-avatar.png")
  const [loading, setLoading] = useState(false)

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
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showError("Validation Error", "Valid email is required")
      return
    }
    if (!formData.password || formData.password.length < 6) {
      showError("Validation Error", "Password must be at least 6 characters")
      return
    }
    if (!formData.dob) {
      showError("Validation Error", "Date of birth is required")
      return
    }

    const fd = new FormData()
    fd.append("Name", formData.name)
    fd.append("Email", formData.email)
    fd.append("Password", formData.password)
    const dob = new Date(formData.dob)
    dob.setDate(dob.getDate() - 1)
    fd.append("Dob", dob.toISOString().split("T")[0])
    if (avatarFile) {
      fd.append("AvatarFile", avatarFile)
    }

    setLoading(true)
    try {
      await onCreateChild(fd)
      showSuccess("Success", "Child account created successfully!")
      setTimeout(() => {
        handleClose()
        onSuccess()
      }, 1500)
    } catch (error: any) {
      showError("Error", error.response?.data?.message || "Failed to create child account")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: "", email: "", password: "", dob: "" })
    setAvatarFile(null)
    setAvatarPreview("/default-avatar.png")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {alert && <AlertPopup type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-500" />
            {t("createDialog.title")}
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
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Upload className="w-4 h-4 text-white" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <p className="text-sm text-gray-500">{t("createDialog.avatarHelp")}</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              {t("createDialog.nameLabel")}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("createDialog.namePlaceholder")}
              className="text-base"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              {t("createDialog.emailLabel")}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t("createDialog.emailPlaceholder")}
              className="text-base"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              {t("createDialog.passwordLabel")}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={t("createDialog.passwordPlaceholder")}
              className="text-base"
            />
            <p className="text-xs text-gray-500">{t("createDialog.passwordHelp")}</p>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {t("createDialog.dobLabel")}
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              className="text-base"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {t("createDialog.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
            {loading ? "Creating..." : t("createDialog.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
