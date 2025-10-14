"use client"

import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Trash2, Check, X } from "lucide-react"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "destructive" | "success" | "warning"
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const icons = {
    destructive: XCircle,
    success: CheckCircle,
    warning: AlertTriangle,
  }

  const iconStyles = {
    destructive: "text-red-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
  }

  const backgroundStyles = {
    destructive: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200",
    success: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
    warning: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200",
  }

  const buttonStyles = {
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/25",
    success:
      "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25",
    warning:
      "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-500/25",
  }

  const actionIcons = {
    destructive: Trash2,
    success: Check,
    warning: AlertTriangle,
  }

  const Icon = icons[variant]
  const ActionIcon = actionIcons[variant]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg border-2 shadow-2xl", backgroundStyles[variant])}>
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Icon className={cn("w-8 h-8", iconStyles[variant])} />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-bold text-slate-800">{title}</DialogTitle>
            <DialogDescription className="text-base text-slate-600 leading-relaxed px-4">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/50">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 h-12 border-slate-300 hover:bg-white/80 backdrop-blur-sm font-medium bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            {cancelText}
          </Button>
          <Button className={cn("flex-1 h-12 text-white font-medium", buttonStyles[variant])} onClick={handleConfirm}>
            <ActionIcon className="w-4 h-4 mr-2" />
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
