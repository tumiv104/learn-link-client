'use client'

import { MissionDetailModal } from "@/components/dashboard/child/MissionDetailModal";
import { MissionStatusCard } from "@/components/dashboard/child/MissionStatusCard";
import { SubmitMissionModal } from "@/components/dashboard/child/SubmitMissionModal";
import { AlertPopup } from "@/components/ui/alert-popup";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MissionSubmission } from "@/data/mission";
import { mockData } from "@/data/mockData";
import { useAlert } from "@/hooks/useAlert";
import { getAllMissionByStatus } from "@/services/mission/missionService";
import { acceptMission, submitMission } from "@/services/submission/submissionService";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export default function MissionScreen() {
  const t = useTranslations("childDashboard.missions")
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMission, setSelectedMission] = useState<MissionSubmission>()
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const { alert,showError, showSuccess, hideAlert } = useAlert()
  const [missionList, setMissionList] = useState<MissionSubmission[]>([])
  const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        description: "",
        onConfirm: () => {},
        variant: "destructive" as "destructive" | "success" | "warning",
    })

  const fetchMission = useCallback(async () => {
    const res = await getAllMissionByStatus("All");
    if (res.data) {
      setMissionList(res.data);
    }
  }, []);

  useEffect(() => {
      fetchMission();
  }, [fetchMission]);

  const handleViewDetail = (mission: MissionSubmission) => {
    setSelectedMission(mission)
    setDetailModalOpen(true)
  }

  const handleStartMission = async (mission: MissionSubmission) => {
    setConfirmDialog({
        open: true,
        title: t("dialog.startTitle"),
        description: t("dialog.startDescription", { title: mission.title }),
        variant: "success",
        onConfirm: async () => {
          try {
            // TODO: Call API to update mission status to Processing
            const res = await acceptMission(mission.missionId)
            if (res.success) {
              await fetchMission();
              setMissionList((prev) =>
                prev.map((m) =>
                  m.missionId === mission.missionId
                    ? { ...m, missionStatus: "Processing" }
                    : m
                )
              );

              setActiveTab("processing");
              setTimeout(() => {
              showSuccess(t("dialog.startSuccessTitle"), t("dialog.startSuccessMessage", { title: mission.title }))
              }, 500)
            } else {
              showError("error", res.message)
            }
          } catch (error) {
            showError("error", t("dialog.startError"))
          }
        },
        })
  }

  const handleOpenSubmit = (mission: any) => {
    setSelectedMission(mission)
    setSubmitModalOpen(true)
  }

  const handleSubmitMission = async (missionId: number, file?: File | null) => {
    const fd = new FormData()

    if (file) {
      fd.append("file", file)
    }
    try {
      // TODO: Call API to submit mission with file
      const res = await submitMission(missionId, fd)
        if (res.success) {
          await fetchMission();
          setMissionList((prev) =>
            prev.map((m) =>
              m.missionId === missionId
                ? { ...m, missionStatus: "Submitted" }
                : m
            )
          );

          setActiveTab("submitted");
          setTimeout(() => {
          showSuccess(t("dialog.submitSuccessTitle"), t("dialog.submitSuccessMessage"))
          }, 500)
        } else {
          showError("error", res.message)
        }
    } catch (error) {
      showError("error", t("dialog.submitError"))
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <ConfirmationDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
          title={confirmDialog.title}
          description={confirmDialog.description}
          variant={confirmDialog.variant}
          onConfirm={confirmDialog.onConfirm}
      />
      <div className="text-center mb-6">
        <div className="text-6xl animate-bounce mb-2">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="assigned">{t("tabs.assigned")}</TabsTrigger>
          <TabsTrigger value="processing">{t("tabs.processing")}</TabsTrigger>
          <TabsTrigger value="submitted">{t("tabs.submitted")}</TabsTrigger>
          <TabsTrigger value="completed">{t("tabs.completed")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {missionList.map((mission) => (
            <MissionStatusCard
              key={mission.missionId}
              mission={mission}
              onViewDetail={() => handleViewDetail(mission)}
              onStart={mission.missionStatus === "Assigned" ? () => handleStartMission(mission) : undefined}
              onSubmit={mission.missionStatus === "Processing" ? () => handleOpenSubmit(mission) : undefined}
            />
          ))}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {missionList
            .filter((m) => m.missionStatus === "Assigned")
            .map((mission) => (
              <MissionStatusCard
                key={mission.missionId}
                mission={mission}
                onViewDetail={() => handleViewDetail(mission)}
                onStart={() => handleStartMission(mission)}
              />
            ))}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {missionList
            .filter((m) => m.missionStatus === "Processing")
            .map((mission) => (
              <MissionStatusCard
                key={mission.missionId}
                mission={mission}
                onViewDetail={() => handleViewDetail(mission)}
                onSubmit={() => handleOpenSubmit(mission)}
              />
            ))}
          </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {missionList
            .filter((m) => m.missionStatus === "Submitted")
            .map((mission) => (
              <MissionStatusCard
                key={mission.missionId}
                mission={mission}
                onViewDetail={() => handleViewDetail(mission)}
              />
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {missionList
            .filter((m) => m.missionStatus === "Completed")
            .map((mission) => (
              <MissionStatusCard
                key={mission.missionId}
                mission={mission}
                onViewDetail={() => handleViewDetail(mission)}
              />
            ))}
        </TabsContent>
      </Tabs>
      {alert && <AlertPopup  type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}

      {mockData.submissions && (
        <>
          {selectedMission && (
            <>
            <MissionDetailModal
              open={detailModalOpen}
              onClose={() => setDetailModalOpen(false)}
              mission={selectedMission}
            />

            <SubmitMissionModal
              open={submitModalOpen}
              onClose={() => setSubmitModalOpen(false)}
              mission={selectedMission}
              onSubmit={handleSubmitMission}
            />
            </>
          )}
        </>
      )}
    </div>
    
  )
}