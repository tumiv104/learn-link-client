export interface NotificationResponse {
  notificationId: number
  userId: number
  type: string
  payload: any
  isRead: boolean
  createdAt: string
}