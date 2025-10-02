'use client'

import { MissionDialog } from "@/components/dashboard/parent/MissionDialog"
import { MissionManagementCard } from "@/components/dashboard/parent/MissionManagementCard"
import { AlertPopup } from "@/components/ui/alert-popup"
import { Button } from "@/components/ui/button"
import { mockData } from "@/data/mockData"
import { useAlert } from "@/hooks/useAlert"
import { assignMission } from "@/services/mission/missionService"
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

  const handleCreateMission = () => {
    setMissionDialog({
      open: true,
      mode: "create",
      mission: undefined,
    })
  }

  const handleOpenDialog = (mode: "view" | "edit", mission: any) => {
    setMissionDialog({
      open: true,
      mode,
      mission,
    })
}

  const handleSaveMission = async (formData: FormData) => {
    //API call
    let success = false;
    if (missionDialog.mode === "create") {
        try {
          const createRes = await assignMission(formData);
          success = createRes.success;
        } catch (err) {
        }
      } else {
        //call api edit
        success = true;
      }
    setTimeout(async () => {
      const title = formData.get("Title")?.toString() ?? "";
      if (missionDialog.mode === "create") {
        if (success) {
          showSuccess( t("alerts.created.title"),
          t("alerts.created.success", { title }))
          setMissionDialog({ ...missionDialog, open: false })
        } else {
          showError(t("alerts.created.title"),
          t("alerts.created.error", { title }))
          setMissionDialog({ ...missionDialog, open: false })
        }
      } else {
        showSuccess(t("alerts.updated.title"),
        t("alerts.updated.success", { title }));
        setMissionDialog({ ...missionDialog, open: false });
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
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
            <Button onClick={handleCreateMission} className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t("create")}
            </Button>
            </div>

            <div className="grid gap-4">
            {mockData.parent_missions.map((mission) => (
                <MissionManagementCard key={mission.MissionId} mission={mission} onOpenDialog={handleOpenDialog}/>
            ))}
        </div>
      </div>
    )
}