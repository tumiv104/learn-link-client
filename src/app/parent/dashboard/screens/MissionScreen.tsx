'use client'

import { useEffect, useState } from "react"
import { MissionDialog } from "@/components/dashboard/parent/MissionDialog"
import { MissionManagementCard } from "@/components/dashboard/parent/MissionManagementCard"
import { AlertPopup } from "@/components/ui/alert-popup"
import { Button } from "@/components/ui/button"
import { mockData } from "@/data/mockData"
import { useAlert } from "@/hooks/useAlert"
import { assignMission, getParentMissions } from "@/services/mission/missionService"
import { Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Mission } from "@/data/mission"
import type { PageResult } from "@/data/pagination"
import type { MissionResponse } from "@/data/missionResponse"
import type { ChildBasicInfoDTO } from "@/data/ChildBasicInfoDTO"
import api from "@/lib/api"
import { getChildren } from "@/services/parent/parentService"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePagination } from "@/hooks/usePagination"
import { PaginationBar } from "@/components/dashboard/PaginationBar"


export default function MissionScreen() {
  const t = useTranslations("parentDashboard.missions")
  const { alert, showSuccess, showError, hideAlert } = useAlert()
  const locale = useLocale()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(false)

  const [totalPages, setTotalPages] = useState(1)
  const { page, setPage, pageSize, setPageSize, getPageNumbers } = usePagination(totalPages, 1, 5)
  
  const [children, setChildren] = useState<ChildBasicInfoDTO[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)


  const [missionDialog, setMissionDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit" | "view",
    mission: undefined as any,
  })

  // Fetch missions
  const fetchMissions = async (pageNumber: number, size: number) => {
    try {
      setLoading(true)
      const data: PageResult<MissionResponse> = await getParentMissions(pageNumber, size)
      const mapped = data.items.map(m => ({
        MissionId: m.missionId,
        Title: m.title,
        Description: m.description,
        Points: m.points,
        Promise: m.promise,
        Punishment: m.punishment,
        Deadline: m.deadline || new Date().toISOString(),
        Status: m.status as Mission["Status"],
        ChildId: m.childId,
        ChildName: m.childName,
        AttachmentUrl: m.attachmentUrl,
        CreatedAt: m.createdAt,
      }))
      setMissions(mapped)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const fetchChildren = async () => {
    try {
      setLoadingChildren(true)
      const res = await getChildren()
      const data: ChildBasicInfoDTO[] = res.map((c: any) => ({
        childId: c.childId != null ? c.childId.toString() : "",
        name: c.name ?? "",
        email: c.email ?? "",
        dob: c.dob ?? "",
        avatarUrl: c.avatarUrl ?? "",
        createdAt: c.createdAt ?? "",
      }))
      setChildren(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingChildren(false)
    }
  }
  fetchChildren()
}, [])


  useEffect(() => {
    fetchMissions(page, pageSize)
  }, [page, pageSize])

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
    // Giữ nguyên hàm cũ
    let success = false
    if (missionDialog.mode === "create") {
      try {
        const createRes = await assignMission(formData)
        success = createRes.success
      } catch (err) {}
    } else {
      // call api edit
      success = true
    }

    setTimeout(async () => {
      const title = formData.get("Title")?.toString() ?? ""
      if (missionDialog.mode === "create") {
        if (success) {
          showSuccess(
            t("alerts.created.title"),
            t("alerts.created.success", { title })
          )
          setMissionDialog({ ...missionDialog, open: false })
          await fetchMissions(page, pageSize) // refresh list
        } else {
          showError(
            t("alerts.created.title"),
            t("alerts.created.error", { title })
          )
          setMissionDialog({ ...missionDialog, open: false })
        }
      } else {
        showSuccess(
          t("alerts.updated.title"),
          t("alerts.updated.success", { title })
        )
        setMissionDialog({ ...missionDialog, open: false })
        await fetchMissions(page, pageSize) // refresh list
      }
    }, 500)
  }
  return (
    <div className="space-y-6">
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
        />
      )}
      
      <MissionDialog
        open={missionDialog.open}
        onOpenChange={(open) => setMissionDialog({ ...missionDialog, open })}
        mode={missionDialog.mode}
        mission={missionDialog.mission}
        children={children || []}   
        onSave={handleSaveMission}
        locale={locale}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
        <Button
          onClick={handleCreateMission}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("create")}
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : missions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No missions yet</div>
        ) : (
          missions.map((mission) => (
            <MissionManagementCard
              key={mission.MissionId}
              mission={mission}
              onOpenDialog={handleOpenDialog}
              locale={locale}
            />
          ))
        )}
      </div>

      {/* Pagination + PageSize */}
      <PaginationBar
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        getPageNumbers={getPageNumbers}
      />
    </div>
  )
}
