"use client"
import useRequireAuth from "@/hooks/useRequireAuth"
import { useCallback, useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/child/Sidebar"
import { Header } from "@/components/dashboard/child/Header"
import HomeScreen from "./screens/HomeScreen"
import MissionScreen from "./screens/MissionsScreen"
import ShopScreen from "./screens/ShopScreen"
import { mockData } from "@/data/mockData"
import { useMissionHub } from "@/hooks/useMissionHub"
import { getPointDetailByUserId } from "@/services/points/pointService"
import { toast } from "sonner"
import { CustomToast } from "@/components/ui/custom-toast"
import { getNotificationByUserId, markAllAsRead, markAsRead } from "@/services/notification/notificationService"
import { NotificationResponse } from "@/data/notification"
import { getAllMissionByStatus } from "@/services/mission/missionService"
import { MissionSubmission } from "@/data/mission"
import { isSameDay, subDays } from "date-fns"

function calculateStreak(missions: MissionSubmission[]) {
  const completedDates = missions
    .filter((m) => m.missionStatus === "Completed")
    .map((m) => new Date(m.updateAt))

  let streak = 0
  let day = new Date()

  while (true) {
    const hasMission = completedDates.some((d) => isSameDay(d, day))
    if (hasMission) {
      streak++
      day = subDays(day, 1)
    } else {
      break
    }
  }

  return streak
}

export default function ChildDashboard() {
  const { user, loading, ready } = useRequireAuth("/auth/login", ["Child"])
  const [activeScreen, setActiveScreen] = useState("home")
  const [balance, setBalance] = useState<number>(0)
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [missionList, setMissionList] = useState<MissionSubmission[]>([])
  const [streak, setStreak] = useState<number>(1)

  const handleMarkNotificationAsRead = useCallback(async (id: number) => {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications((prev) => prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)))
    }
  }, [])

  const handleMarkAllNotificationsAsRead = useCallback(async () => {
    if (user) {
      const res = await markAllAsRead(user?.id);
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      }
    }
    
  }, [user])

  const addNotification = (notification: NotificationResponse) => {
    setNotifications(prev => [notification, ...prev])
  }

  const fetchBalance = useCallback(async () => {
    if (user) {
      const res = await getPointDetailByUserId(user.id);
      if (res.data) {
        setBalance(res.data.balance);
      }
    }
  }, [user]);

  const fetchNoti = async () => {
    if (user) {
      const res = await getNotificationByUserId(user.id);
      const notifications: NotificationResponse[] = res.data.map((n: any) => ({
        ...n,
        payload: JSON.parse(n.payload),
      }))
      setNotifications(notifications);
    }
  }

  const fetchMission = useCallback(async () => {
      const res = await getAllMissionByStatus("All");
      if (res.data) {
        setMissionList(res.data);
        setStreak(calculateStreak(res.data));
      }
    }, []);
  useEffect(() => {
      fetchBalance();
      fetchNoti();
      fetchMission();
  }, [user, fetchBalance]);

  useMissionHub(user?.id, {
    onMissionCreated: (mission) => {
      toast.custom(() => (
        <CustomToast 
          type="created"
          title="New Mission Available!"
          description={`${mission.title} has been assigned to you!`}
        />
      ))
      addNotification({
        notificationId: Date.now(), // tạm, backend có id thật nhưng FE dùng id local
        userId: mission.childId,
        type: "MissionAssigned",
        payload: {
          missionId: mission.missionId,
          title: mission.title,
        },
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      // TODO: show notification
    },
    onMissionReviewed: (data) => {
      toast.custom(() => (
        <CustomToast 
          type="reviewed"
          title="Mission Reviewed!"
          description={`${data.title} - Score: ${data.score || 0}/100${data.feedback ? ` - ${data.feedback}` : ""}`}
          approve={data.status == "Approved"}
        />
      ))
      addNotification({
        notificationId: Date.now(), // tạm, backend có id thật nhưng FE dùng id local
        userId: data.childId,
        type: "MissionReviewed",
        payload: {
          missionId: data.mission.missionId,
          title: data.mission.title,
        },
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      if (data.status == "Approved") {
        console.log("fetch balance")
        fetchBalance();
      }
      // TODO: update mission status in UI
    },
  });
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} name={user?.name} player={mockData.player} />
      <Header 
        activeScreen={activeScreen} 
        player={mockData.player} 
        points={balance}
        streak={streak}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      />

      <div className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto pt-8">
          {activeScreen === "home" && <HomeScreen user={user} points={balance} missions={missionList} streak={streak}/>}
          {activeScreen === "missions" && <MissionScreen/>}
          {activeScreen === "shop" && <ShopScreen user={user} points={balance}/>}
          {/* {activeScreen === "achievements" && <AchievementsScreen/>}
          {activeScreen === "profile" && <ProfileScreen user={user} onLogout={handleLogout}/>} */}
        </div>
      </div>
    </div>
  )
}
