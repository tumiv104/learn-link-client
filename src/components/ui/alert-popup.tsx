"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

interface AlertProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  className?: string
}

export function AlertPopup({ type, title, message, duration = 5000, onClose, className }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const styles = {
    success:
      "bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-l-emerald-500 border-emerald-200 text-emerald-900 shadow-lg shadow-emerald-100",
    error:
      "bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-l-red-500 border-red-200 text-red-900 shadow-lg shadow-red-100",
    warning:
      "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-l-amber-500 border-amber-200 text-amber-900 shadow-lg shadow-amber-100",
    info: "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 border-blue-200 text-blue-900 shadow-lg shadow-blue-100",
  }

  const iconStyles = {
    success: "text-emerald-600",
    error: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
  }

  const Icon = icons[type]

  return (
    <div className={cn("fixed top-4 right-4 z-9999 max-w-md animate-in slide-in-from-right-full", className)}>
      <div className={cn("p-5 rounded-xl border backdrop-blur-sm", styles[type])}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Icon className={cn("w-6 h-6", iconStyles[type])} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg leading-tight">{title}</h4>
            {message && <p className="text-sm mt-2 opacity-80 leading-relaxed">{message}</p>}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
          >
            <X className="w-5 h-5 opacity-60 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  )
}
