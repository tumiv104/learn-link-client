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
} from "lucide-react"
import { useState } from "react"
import MissionScreen from "./screens/MissionScreen"
import SubmissionScreen from "./screens/SubmissionScreen"
import RewardScreen from "./screens/RewardScreen"
import ReportScreen from "./screens/ReportScreen"
import ProfileScreen from "./screens/ProfileScreen"
import OverviewScreen from "./screens/OverviewScreen"

export default function ParentDashboard() {
  const { user, loading, ready } = useRequireAuth("/auth/login", ["Parent"])
  const [activeTab, setActiveTab] = useState("overview")

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      <Header />

      <div className="p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-600 text-lg">Here's how your children are doing today</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="missions" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Missions
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Submissions
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Profile
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
