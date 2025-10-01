"use client"
import useRequireAuth from "@/hooks/useRequireAuth"
import { useCallback, useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/child/Sidebar"
import { Header } from "@/components/dashboard/child/Header"
import { useAuth } from "@/context/AuthContext"
import HomeScreen from "./screens/HomeScreen"
import MissionScreen from "./screens/MissionsScreen"
import ShopScreen from "./screens/ShopScreen"
import AchievementsScreen from "./screens/AchievementsScreen"
import ProfileScreen from "./screens/ProfileScreen"
import { mockData } from "@/data/mockData"
import { getPointDetailByUserId } from "@/services/points/pointService"
import { useAlert } from "@/hooks/useAlert"

export default function ChildDashboard() {
  const { user, loading, ready } = useRequireAuth("/auth/login", ["Child"])
  const [activeScreen, setActiveScreen] = useState("home")
  const { logout } = useAuth()
  const [selectedMission, setSelectedMission] = useState<any>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const { alert, showAlert, hideAlert } = useAlert()
  const [balance, setBalance] = useState<number>(0)

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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl animate-bounce mb-4">🚀</div>
          <div className="text-white text-xl font-bold animate-pulse">Loading your adventure...</div>
        </div>
      </div>
    )
  
  if (!ready) return null;

  const handleLogout = async () => {
      try {
        await logout()
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} name={user?.name} player={mockData.player} />
      <Header activeScreen={activeScreen} player={mockData.player} points={balance}/>

      <div className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto pt-8">
          {activeScreen === "home" && <HomeScreen user={user} points={balance}/>}
          {activeScreen === "missions" && <MissionScreen/>}
          {activeScreen === "shop" && <ShopScreen/>}
          {activeScreen === "achievements" && <AchievementsScreen/>}
          {activeScreen === "profile" && <ProfileScreen user={user} onLogout={handleLogout}/>}
        </div>
      </div>
    </div>
  )
}
