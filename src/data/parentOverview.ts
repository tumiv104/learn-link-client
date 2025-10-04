export interface OverviewStats {
  totalMissions: number
  completedMissions: number
  pendingSubmissions: number
  pendingRedemptions: number
}

export interface ChildSummary {
  userId: number
  name: string
  avatarUrl?: string
  totalPoints: number
}

export interface Notification {
  notificationId: number
  message: string
  createdAt: string
  type: string
  isRead: boolean
}

export interface ParentOverview {
  overview: OverviewStats
  children: ChildSummary[]
  recentNotifications: Notification[]
}
