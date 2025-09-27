'use client'

import { MissionDialog } from "@/components/dashboard/parent/MissionDialog"
import { MissionManagementCard } from "@/components/dashboard/parent/MissionManagementCard"
import { AlertPopup } from "@/components/ui/alert-popup"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { mockData } from "@/data/mockData"
import { useAlert } from "@/hooks/useAlert"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function MissionScreen() {
  const t = useTranslations("parentDashboard.missions")
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [missionDialog, setMissionDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit" | "view",
    mission: undefined as any,
  })
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "destructive" as "destructive" | "success" | "warning",
  })
  const handleCreateMission = () => {
    setMissionDialog({
      open: true,
      mode: "create",
      mission: undefined,
    })
  }



  const handleDeleteMission = (mission: any) => {
    setConfirmDialog({
      open: true,
      title: "Delete Mission",
      description: `Are you sure you want to delete "${mission.Title}"? This action cannot be undone.`,
      variant: "destructive",
      onConfirm: () => {
        // Simulate API call
        setTimeout(() => {
          showSuccess("Mission Deleted", `"${mission.Title}" has been successfully deleted.`)
        }, 500)
      },
    })
  }

  const handleSaveMission = (mission: any) => {
    // Simulate API call
    setTimeout(() => {
      if (missionDialog.mode === "create") {
        if (mission.Title.trim() === "") {
          showError("Error", "Mission title is required")
        } else {
          showSuccess("Mission Created", `"${mission.Title}" has been successfully created.`)
          setMissionDialog({ ...missionDialog, open: false }) // close dialog when success
        }
      } else {
        showSuccess("Mission Updated", `"${mission.Title}" has been successfully updated.`)
        setMissionDialog({ ...missionDialog, open: false })
      }
    }, 500)
  }
    return (
      <div className="space-y-6">
        {alert && <AlertPopup type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}

      <MissionDialog
        open={missionDialog.open}
        onOpenChange={(open) => setMissionDialog({ ...missionDialog, open })}
        mode={missionDialog.mode}
        mission={missionDialog.mission}
        children={mockData.children}
        onSave={handleSaveMission}
      />

      {/* <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
      /> */}
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
            <Button onClick={handleCreateMission} className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t("create")}
            </Button>
            </div>

            <div className="grid gap-4">
            {mockData.parent_missions.map((mission) => (
                <MissionManagementCard key={mission.MissionId} mission={mission} />
            ))}
        </div>
      </div>
    )
}