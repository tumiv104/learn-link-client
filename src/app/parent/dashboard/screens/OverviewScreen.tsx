"use client"

import { useEffect, useState } from "react"
import { getParentOverview } from "@/services/dashboard/dashboardService"
import type { ParentOverview } from "@/data/parentOverview"
import { NotificationItem } from "@/components/dashboard/NotificationItem"
import { StatCard } from "@/components/dashboard/StatCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Users, Loader2, UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"
import CreateChildDialog from "@/components/dashboard/parent/CreateChildDialog"
import ChildProfileDialog from "@/components/dashboard/parent/ChildProfileDialog"
import { createChild, getChildProfile } from "@/services/parent/parentService"
import { UserProfileDTO } from "@/data/UserProfileDTO"

export default function OverviewScreen() {
  const t = useTranslations("parentDashboard.overview")

  const [overview, setOverview] = useState<ParentOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [childProfile, setChildProfile] = useState<UserProfileDTO | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getParentOverview()
      setOverview(data)
    } catch (err: any) {
      setError(err.message || t("error"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateChild = async (formData: FormData) => {
    await createChild(formData)
  }

  const handleCreateSuccess = () => {
    fetchData()
  }

  // 🟩 Hàm lấy thông tin chi tiết của con
  const handleViewChildProfile = async (childId: number) => {
    setSelectedChildId(childId)
    setProfileLoading(true)
    setProfileDialogOpen(true)
    try {
      const data = await getChildProfile(childId)
      setChildProfile(data)
    } catch (err) {
      console.error("Failed to fetch child profile:", err)
      setChildProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {t("error")}: {error}
      </div>
    )
  }

  if (!overview) {
    return <div className="text-center py-12 text-gray-500">{t("noData")}</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={t("stats.totalMissions.title")}
          value={overview.overview.totalMissions}
          description={t("stats.totalMissions.desc")}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title={t("stats.completed.title")}
          value={overview.overview.completedMissions}
          description={t("stats.completed.desc")}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title={t("stats.pendingReviews.title")}
          value={overview.overview.pendingSubmissions}
          description={t("stats.pendingReviews.desc")}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          title={t("stats.redemptions.title")}
          value={overview.overview.pendingRedemptions}
          description={t("stats.redemptions.desc")}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Children + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Children */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                {t("children.title")}
              </CardTitle>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t("children.createButton")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.children.map((child) => (
                <div
                  key={child.userId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${child.avatarUrl}`}
                      alt={child.name}
                      className="w-12 h-12 rounded-full object-cover border"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png"
                      }}
                    />
                    <div>
                      <h4 className="font-semibold">{child.name}</h4>
                      <p className="text-sm text-gray-600">
                        {t("children.points", { points: child.totalPoints })}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChildProfile(child.userId)} // ✅ gọi API khi click
                  >
                    {t("children.viewDetails")}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              {t("activity.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.notificationId}
                  message={notification.message}
                  time={notification.createdAt}
                  type={notification.type as
                    | "completion"
                    | "reward"
                    | "submission"}
                  isRead={notification.isRead}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateChildDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        onCreateChild={handleCreateChild}
      />

      <ChildProfileDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        child={childProfile}
        loading={profileLoading}
      />
    </div>
  )
}
