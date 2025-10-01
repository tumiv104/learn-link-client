"use client"
import useRequireAuth from "@/hooks/useRequireAuth"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Gift,
  Target,
  BookOpen,
  FileText,
  Coins,
  Plus,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import MissionScreen from "./screens/MissionScreen"
import SubmissionScreen from "./screens/SubmissionScreen"
import RewardScreen from "./screens/RewardScreen"
import ReportScreen from "./screens/ReportScreen"
import ProfileScreen from "./screens/ProfileScreen"
import OverviewScreen from "./screens/OverviewScreen"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BuyPointsDialog } from "@/components/dashboard/parent/BuyPointsDialog"
import { createMomoPayment, updatePaymentStatus } from "@/services/payment/paymentService"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getPointDetailByUserId } from "@/services/points/pointService"

export default function ParentDashboard() {
  const t = useTranslations("parentDashboard")
  const { user, loading, ready } = useRequireAuth("/auth/login", ["Parent"])
  const [activeTab, setActiveTab] = useState("overview")
  const [buyPointsDialog, setBuyPointsDialog] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [callbackHandled, setCallbackHandled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchBalance = useCallback(async () => {
    if (user) {
      const res = await getPointDetailByUserId(user.id);
      if (res.data) {
        setBalance(res.data.balance);
      }
    }
  }, [user]);

  useEffect(() => {
      fetchBalance();
  }, [user, fetchBalance]);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const resultCode = searchParams.get("resultCode");

    const handlePaymentCallback = async () => {
      if (orderId && resultCode && !callbackHandled) {
        setCallbackHandled(true); // đánh dấu đã xử lý
        const paymentId = Number.parseInt(orderId);
        let status = "";

        if (resultCode === "0") {
          status = "success";
        }

        await updatePaymentStatus(paymentId, status);
        if (resultCode === "0") await fetchBalance();

        // clear params
        router.replace(pathname);
      }
    };

    handlePaymentCallback();
  }, [searchParams, callbackHandled, router, pathname, fetchBalance]);

  if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
    </div>
  )

  if (!ready) return null;

  const handleBuyPoints = async (points: number, paymentMethod: string) => {
    try {
      if (user == null) {
        throw new Error("Payment creation failed");
      }
      let paymentUrl : string = "";
      if (paymentMethod == "momo") {
        console.log(user.id, points * 1000)
        const response = await createMomoPayment(user?.id, points * 1000);
        if (!response.success) {
          throw new Error("Create payment failed");
        }
        paymentUrl = response.data;
      }
      else {
        throw new Error("This payment method is temporarily not supported.");
      }
      if (paymentUrl != "") {
        // Redirect to external payment page
        window.location.href = paymentUrl
      } else {
        throw new Error("No payment URL received")
      }
    } catch (error) {
      console.error("Buy points failed:", error)
      //showError("Payment Failed", "Unable to process payment. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      <Header />
      <BuyPointsDialog open={buyPointsDialog} onOpenChange={setBuyPointsDialog} onPurchase={handleBuyPoints} />
      <div className="p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{t("welcome")}, {user?.name}! 👋</h1>
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
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Your Balance</p>
                      <p className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {balance}
                      </p>
                      <p className="text-xs text-amber-600 font-medium">points available</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setBuyPointsDialog(true)}
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-5 py-2.5 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buy Points
                  </Button>
                  </div>
                </CardContent>
              </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
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
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                {t("tabs.rewards")}
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

            <TabsContent value="overview"><OverviewScreen/></TabsContent>

            <TabsContent value="missions"><MissionScreen/></TabsContent>

            <TabsContent value="submissions"><SubmissionScreen/></TabsContent>

            <TabsContent value="rewards"><RewardScreen/></TabsContent>

            <TabsContent value="reports"><ReportScreen/></TabsContent>

            <TabsContent value="profile"><ProfileScreen/></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
