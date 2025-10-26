export interface UserProfileDTO {
  userId: number
  name: string
  email: string
  roleName: string
  dob?: string
  avatarUrl?: string
  createdAt?: string
  totalPoints: number
  childrenCount?: number
  parentName?: string
  isPremium?: boolean
}
