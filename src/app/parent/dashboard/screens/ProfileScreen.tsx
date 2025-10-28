"use client"

import { useEffect, useState } from "react"
import { getUserProfile } from "@/services/user/userService"
import type { UserProfileDTO } from "@/data/UserProfileDTO"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, User, Star, Users, Calendar, Award, Edit3, Mail, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { EditProfileDialog } from "@/components/dashboard/parent/EditProfileDialog"
import { updateUserProfile } from "@/services/user/userService"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserDto } from "@/services/auth/authService"

interface ProfileScreenProps {
  user: UserDto
}

export default function ProfileScreen({ user } : ProfileScreenProps) {
  const t = useTranslations("parentDashboard.profile")

  const [profile, setProfile] = useState<UserProfileDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await getUserProfile(user.id)
      setProfile(data)
    } catch (err: any) {
      setError(err.message || t("errorLoading"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdateProfile = async (formData: FormData) => {
    await updateUserProfile(user.id, formData)
  }

  const handleUpdateSuccess = () => {
    fetchProfile() // Refresh the profile data
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <span className="text-lg font-medium text-gray-600">{t("loadingProfile")}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <div className="text-red-500 text-lg font-medium">{error}</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <div className="text-gray-600 text-lg">{t("noProfileData")}</div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
              <p className="text-gray-600">{t("subtitle")}</p>
            </div>
          </div>
          <Button onClick={() => setEditDialogOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Edit3 className="w-4 h-4 mr-2" />
            {t("editButton")}
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white min-h-[120px] py-4 flex items-center">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarImage
                  src={
                    profile.avatarUrl ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatarUrl}` : "/default-avatar.png"
                  }
                  alt={profile.name}
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
                <AvatarFallback className="text-xl font-bold bg-white text-blue-600">{profile.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
                  {profile.isPremium && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Crown className="w-6 h-6 text-yellow-300 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>Premium Member</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 opacity-80" />
                  <p className="opacity-90">{profile.email}</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <Award className="w-4 h-4" />
                  <span>{profile.roleName}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">{t("dob")}</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {profile.dob ? new Date(profile.dob).toLocaleDateString("vi-VN") : t("notUpdated")}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-700">{t("joinedDate")}</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("vi-VN") : t("notAvailable")}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-gray-700">{t("points")}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{profile.totalPoints?.toLocaleString() || 0}</p>
              </div>

              {profile.roleName === "Parent" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="font-medium text-gray-700">{t("childrenCount")}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{profile.childrenCount || 0}</p>
                </div>
              )}

              {profile.roleName === "Child" && profile.parentName && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-pink-500" />
                    <span className="font-medium text-gray-700">{t("parent")}</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{profile.parentName}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <EditProfileDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          profile={profile}
          onSuccess={handleUpdateSuccess}
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    </TooltipProvider>
  )
}
