"use client"

import { useState, useCallback } from "react"

interface AlertState {
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
}

export function useAlert() {
  const [alert, setAlert] = useState<AlertState | null>(null)

  const showAlert = useCallback((alertData: AlertState) => {
    setAlert(alertData)
  }, [])

  const hideAlert = useCallback(() => {
    setAlert(null)
  }, [])

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showAlert({ type: "success", title, message })
    },
    [showAlert],
  )

  const showError = useCallback(
    (title: string, message?: string) => {
      showAlert({ type: "error", title, message })
    },
    [showAlert],
  )

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showAlert({ type: "warning", title, message })
    },
    [showAlert],
  )

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showAlert({ type: "info", title, message })
    },
    [showAlert],
  )

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}