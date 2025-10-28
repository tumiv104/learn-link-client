"use client"
import useRequireAuth from "@/hooks/useRequireAuth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Target, BookOpen, FileText, Coins, Plus, Crown } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import MissionScreen from "./screens/MissionScreen"
import SubmissionScreen from "./screens/SubmissionScreen"
import ReportScreen from "./screens/ReportScreen"
import ProfileScreen from "./screens/ProfileScreen"
import OverviewScreen from "./screens/OverviewScreen"
import { useTranslations } from "next-intl"
import { useMissionHub } from "@/hooks/useMissionHub"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BuyPointsDialog } from "@/components/dashboard/parent/BuyPointsDialog"
import { PremiumUpgradeDialog } from "@/components/dashboard/parent/PremiumUpgradeDialog"
import { createPayOSPayment, updatePaymentStatus, createPremiumPayment } from "@/services/payment/paymentService"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getPointDetailByUserId } from "@/services/points/pointService"
import { CustomToast } from "@/components/ui/custom-toast"
import { toast } from "sonner"
import Header from "@/components/dashboard/parent/Header"
import type { NotificationResponse } from "@/data/notification"
import { getNotificationByUserId, markAllAsRead, markAsRead } from "@/services/notification/notificationService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { getParentProfile } from "@/services/parent/parentService"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"

export default function ParentDashboard() {
  const t = useTranslations("parentDashboard")
  const { user, loading, ready } = useRequireAuth("/auth/login", ["Parent"])
  const [activeTab, setActiveTab] = useState("overview")
  const [buyPointsDialog, setBuyPointsDialog] = useState(false)
  const [premiumUpgradeDialog, setPremiumUpgradeDialog] = useState(false)
  const [premiumLimitPopup, setPremiumLimitPopup] = useState(false)
  const [premiumLimitMessage, setPremiumLimitMessage] = useState("")
  const [balance, setBalance] = useState<number>(0)
  const [callbackHandled, setCallbackHandled] = useState(false)
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isPremium, setIsPremium] = useState(false)
  const [premiumExpiry, setPremiumExpiry] = useState<string | undefined>()
  const [premiumLimitType, setPremiumLimitType] = useState<"child" | "mission">("mission")
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleMarkNotificationAsRead = useCallback(async (id: number) => {
    const res = await markAsRead(id)
    if (res.success) {
      setNotifications((prev) => prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)))
    }
  }, [])

  const handleMarkAllNotificationsAsRead = useCallback(async () => {
    const res = await markAllAsRead(user.id)
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }
  }, [user])

  const addNotification = (notification: NotificationResponse) => {
    setNotifications((prev) => [notification, ...prev])
  }

  const fetchNoti = async () => {
    const res = await getNotificationByUserId(user.id)
    const notifications: NotificationResponse[] = res.data.map((n: any) => ({
      ...n,
      payload: JSON.parse(n.payload),
    }))
    setNotifications(notifications)
  }

  const fetchBalance = useCallback(async () => {
    const res = await getPointDetailByUserId(user.id)
    if (res.data) {
      setBalance(res.data.balance)
    }
  }, [user])

 const fetchPremiumStatus = useCallback(async () => {
    try {
      const profile = await getParentProfile(user.id);
      setIsPremium(profile.isPremium ?? false);
    } catch (error) {
    }
  }, [user]);

  useEffect(() => {
    fetchBalance()
    fetchNoti()
    fetchPremiumStatus()
  }, [user, fetchBalance, fetchPremiumStatus])

  useEffect(() => {
    const code = searchParams.get("code")
    const paymentStatus = searchParams.get("status")
    const orderCode = searchParams.get("orderCode")

    const handlePaymentCallback = async () => {
      if (code && paymentStatus && orderCode && !callbackHandled) {
        setCallbackHandled(true)
        let status = ""

        if (code === "00" && paymentStatus === "PAID") status = "success"

        await updatePaymentStatus(orderCode, status)
        if (code === "00" && paymentStatus === "PAID") {
          await fetchBalance()
          await fetchPremiumStatus()
        }

        router.replace(pathname)
      }
    }

    handlePaymentCallback()
  }, [searchParams, callbackHandled, router, pathname, fetchBalance, fetchPremiumStatus])

  useMissionHub(user?.id, {
    onMissionStarted: (data) => {
      toast.custom(() => (
        <CustomToast
          type="started"
          title={t("toast.missionStarted.title")}
          description={t("toast.missionStarted.desc", {
            childName: data.childName,
            title: data.title,
          })}
        />
      ))
      addNotification({
        notificationId: Date.now(),
        userId: data.parentId,
        type: "MissionStarted",
        payload: {
          missionId: data.missionId,
          title: data.title,
        },
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    },
    onMissionSubmitted: (data) => {
      toast.custom(() => (
        <CustomToast
          type="submitted"
          title={t("toast.missionSubmitted.title")}
          description={t("toast.missionSubmitted.desc", {
            childName: data.childName,
            title: data.title,
          })}
        />
      ))
      addNotification({
        notificationId: Date.now(),
        userId: data.parentId,
        type: "MissionSubmitted",
        payload: {
          missionId: data.missionId,
          title: data.title,
        },
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    },
  })

  const onApproveSubmission = useCallback(async () => {
    fetchBalance()
  }, [user])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )

  if (!ready) return null

  const handleBuyPoints = async (points: number, paymentMethod: string) => {
    try {
      if (user == null) {
        throw new Error(t("errors.paymentCreationFailed"))
      }
      let paymentUrl = ""
      if (paymentMethod == "bank") {
        const response = await createPayOSPayment(user.id, points * 1000)
        if (!response.success) {
          throw new Error(t("errors.createPaymentFailed"))
        }
        paymentUrl = response.data
      } else {
        throw new Error(t("errors.unsupportedPayment"))
      }
      if (paymentUrl != "") {
        window.location.href = paymentUrl
      } else {
        throw new Error(t("errors.noPaymentUrl"))
      }
    } catch (error) {
      showError(t("errors.buyPointsFailed"), "" + error);
    }
  }

  const handleUpgradePremium = async () => {
    try {
      if (user == null) {
        throw new Error(t("errors.paymentCreationFailed"))
      }
      const response = await createPremiumPayment(user.id)
      if (!response.success) {
        throw new Error(t("errors.createPaymentFailed"))
      }
      const paymentUrl = response.data
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        throw new Error(t("errors.noPaymentUrl"))
      }
    } catch (error) {
      showError(t("errors.upgradeFailed"), "" + error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      {alert && <AlertPopup type={alert.type} title={alert.title} message={alert.message} onClose={hideAlert} />}
      <Header
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      />
      <BuyPointsDialog open={buyPointsDialog} onOpenChange={setBuyPointsDialog} onPurchase={handleBuyPoints} />
      <PremiumUpgradeDialog
        open={premiumUpgradeDialog}
        onOpenChange={setPremiumUpgradeDialog}
        onUpgrade={handleUpgradePremium}
        isPremium={isPremium}
        premiumExpiry={premiumExpiry}
      />
      <Dialog open={premiumLimitPopup} onOpenChange={setPremiumLimitPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-purple-600" />
              {t("premiumLimit.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">{premiumLimitMessage}</p>
            <p className="text-sm text-gray-600 mb-6">
          {premiumLimitType === "child"
            ? t("premiumLimit.childDescription")
            : t("premiumLimit.missionDescription")}
        </p>

          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPremiumLimitPopup(false)}>
              {t("premiumLimit.cancel")}
            </Button>
            <Button
              onClick={() => {
                setPremiumLimitPopup(false)
                setPremiumUpgradeDialog(true)
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {t("premiumLimit.upgrade")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {t("welcome")}, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">{t("subtitle")}</p>
            </div>
            <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="px-4 py-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t("balance.title")}</p>
                      <p className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {balance}
                      </p>
                      <p className="text-xs text-amber-600 font-medium">{t("balance.subtitle")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setBuyPointsDialog(true)}
                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-5 py-2.5 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t("balance.buyButton")}
                    </Button>
                    <Button
                      onClick={() => setPremiumUpgradeDialog(true)}
                      className={`font-bold px-5 py-2.5 shadow-xl hover:shadow-2xl transition-all ${
                        isPremium
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          : "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
                      } text-white`}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {isPremium ? t("balance.premiumStatus") : t("balance.premiumButton")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t("tabs.overview")}
              </TabsTrigger>
              <TabsTrigger value="missions" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {t("tabs.missions")}
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t("tabs.submissions")}
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {t("tabs.reports")}
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t("tabs.profile")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewScreen
                onPremiumLimitReached={(msg, type) => {
                  setPremiumLimitMessage(msg)
                  setPremiumLimitType(type)   
                  setPremiumLimitPopup(true)
                }}
                user={user}
              />
            </TabsContent>

            <TabsContent value="missions">
              <MissionScreen
                onPremiumLimitReached={(msg, type) => {
                  setPremiumLimitMessage(msg)
                  setPremiumLimitType(type)
                  setPremiumLimitPopup(true)
                }}
                balance={balance}
                user={user}
              />
            </TabsContent>


            <TabsContent value="submissions">
              <SubmissionScreen onApprove={onApproveSubmission} user={user}/>
            </TabsContent>

            <TabsContent value="reports">
              <ReportScreen user={user}/>
            </TabsContent>

            <TabsContent value="profile">
              <ProfileScreen user={user}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
