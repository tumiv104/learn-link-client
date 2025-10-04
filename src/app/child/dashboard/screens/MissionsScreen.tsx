'use client'

import { MissionCard } from "@/components/dashboard/child/MissionCard";
import { MissionDetailModal } from "@/components/dashboard/child/MissionDetailModal";
import { MissionStatusCard } from "@/components/dashboard/child/MissionStatusCard";
import { SubmitMissionModal } from "@/components/dashboard/child/SubmitMissionModal";
import { AlertPopup } from "@/components/ui/alert-popup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockData } from "@/data/mockData";
import { useAlert } from "@/hooks/useAlert";
import { getAllMission, MissionResponse } from "@/services/mission/missionService";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export default function MissionScreen() {
  const mockData = {
    submissions: [
    {
      submissionId: 1,
      missionId: 6,
      fileUrl: "https://example.com/volcano-project.pdf",
      submittedAt: "2024-12-22T14:30:00",
      status: "Pending",
    },
    {
      submissionId: 2,
      missionId: 5,
      fileUrl: "https://example.com/book-summary.pdf",
      submittedAt: "2024-12-12T16:00:00",
      status: "Approved",
      feedback: "Excellent work! Your summary was very detailed and well-written.",
      score: 95,
      reviewedAt: "2024-12-13T10:00:00",
    },
  ],
  }
  const t = useTranslations("childDashboard.missions")
  const [selectedMission, setSelectedMission] = useState<any>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const { alert,showError, showSuccess, showAlert, hideAlert } = useAlert()
  const [missionList, setMissionList] = useState<MissionResponse[]>([])
  const [subMissionList, setSubMissionList] = useState<any[]>([])

  const fetchMission = useCallback(async () => {
    const res = await getAllMission();
    if (res.data) {
      setMissionList(res.data.items);
    }
  }, []);

  useEffect(() => {
      fetchMission();
  }, [fetchMission]);

  const handleViewDetail = (mission: any) => {
    setSelectedMission(mission)
    setDetailModalOpen(true)
  }

  const handleStartMission = async (mission: any) => {
    try {
      // TODO: Call API to update mission status to Processing
      console.log("[v0] Starting mission:", mission.missionId)
      showSuccess("success", "Mission started successfully! Good luck!")
    } catch (error) {
      showError("error", "Failed to start mission. Please try again.")
    }
  }

  const handleOpenSubmit = (mission: any) => {
    setSelectedMission(mission)
    setSubmitModalOpen(true)
  }

  const handleSubmitMission = async (file: File) => {
    try {
      // TODO: Call API to submit mission with file
      console.log("[v0] Submitting mission:", selectedMission.missionId, "with file:", file.name)
      showSuccess("success", "Mission submitted successfully! Waiting for review.")
    } catch (error) {
      showError("error", "Failed to submit mission. Please try again.")
    }
  }

  const getSubmissionForMission = (mission : any) => {
    return mockData.submissions.find((s) => s.missionId === mission.missionId)
  }

  return (
    // <div className="space-y-6 pb-24">
    //       <div className="text-center mb-6">
    //         <div className="text-6xl animate-bounce mb-2">⚔️</div>
    //         <h2 className="text-3xl font-bold text-gray-800">{t("title")}</h2>
    //         <p className="text-gray-600">{t("subtitle")}</p>
    //       </div>
    
    //       <div className="grid gap-4">
    //         {missionList.map((mission) => (
    //           <MissionCard key={mission.id} {...mission} />
    //         ))}
    //       </div>
    //     </div>
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <div className="text-6xl animate-bounce mb-2">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {missionList.map((mission) => (
            <MissionStatusCard
              key={mission.missionId}
              mission={mission}
              onViewDetail={() => handleViewDetail(mission)}
              onStart={mission.status === "Assigned" ? () => handleStartMission(mission) : undefined}
              onSubmit={mission.status === "Processing" ? () => handleOpenSubmit(mission) : undefined}
            />
          ))}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {missionList
            .filter((m) => m.status === "Assigned")
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
            .filter((m) => m.status === "Processing")
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
            .filter((m) => m.status === "Submitted")
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
            .filter((m) => m.status === "Completed")
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
              submission={getSubmissionForMission(selectedMission)}
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