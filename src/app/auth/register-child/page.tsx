"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Camera, Star, Heart, Sparkles, Gift, Mail, Lock, EyeOff, Eye } from "lucide-react"
import Link from "next/link"
import useRequireAuth from "@/hooks/useRequireAuth"

const avatarOptions = [
  { id: 1, emoji: "🦄", name: "Unicorn", color: "bg-purple-100" },
  { id: 2, emoji: "🐻", name: "Bear", color: "bg-amber-100" },
  { id: 3, emoji: "🦊", name: "Fox", color: "bg-orange-100" },
  { id: 4, emoji: "🐸", name: "Frog", color: "bg-green-100" },
  { id: 5, emoji: "🐱", name: "Cat", color: "bg-pink-100" },
  { id: 6, emoji: "🐶", name: "Dog", color: "bg-blue-100" },
  { id: 7, emoji: "🦋", name: "Butterfly", color: "bg-indigo-100" },
  { id: 8, emoji: "🌟", name: "Star", color: "bg-yellow-100" },
]

export default function RegisterChildPage() {
  const { registerChild, loading, user } = useAuth()
  const { ready } = useRequireAuth("/auth/login", ["Parent"])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    selectedAvatar: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarSelect = (avatar: (typeof avatarOptions)[0]) => {
    setFormData((prev) => ({ ...prev, selectedAvatar: avatar.emoji }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.dateOfBirth) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      if (user == null) return;
      const dob = new Date(formData.dateOfBirth)
      await registerChild(
        formData.name,
        formData.email,
        formData.password,
        user.id,
        dob,
        formData.selectedAvatar || "🌟",
      )

      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error: any) {
      setError(error?.message || "Failed to create child account. Please try again.")
    }
  }

  const handleSkip = () => {
    router.push("/parent/dashboard")
  }

  if (!ready) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-2 border-green-200 bg-green-50">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Awesome! 🎉</h2>
            <p className="text-green-600 mb-4">Your child's account has been created successfully!</p>
            <p className="text-sm text-green-600">Taking you to the login page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Learn Link
            </h1>
          </div>
          <p className="text-muted-foreground">Now let's create your child's magical learning account! ✨</p>
        </div>

        <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-green-700 flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Create Child Account
              <Heart className="w-6 h-6 text-red-500" />
            </CardTitle>
            <CardDescription className="text-green-600">
              Set up a fun learning space for your little one!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-300 bg-red-50">
                  <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-green-500" />
                  Child's Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="What's your child's name?"
                  className="h-12 border-2 border-green-200 focus:border-green-400 transition-colors bg-white text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your child's email"
                  className="h-12 border-2 border-green-200 focus:border-green-400 transition-colors bg-white text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Birthday *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-12 border-2 border-green-200 focus:border-green-400 transition-colors bg-white text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="h-12 border-2 border-green-200 focus:border-green-400 transition-colors bg-white text-lg"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-green-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-green-500" />
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="h-12 border-2 border-green-200 focus:border-green-400 transition-colors bg-white text-lg"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-green-500" />
                  Choose a Fun Avatar! 🎨
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105
                        ${
                          formData.selectedAvatar === avatar.emoji
                            ? "border-green-400 bg-green-100 shadow-lg"
                            : "border-green-200 bg-white hover:border-green-300"
                        }
                      `}
                    >
                      <div
                        className={`w-full h-12 ${avatar.color} rounded-lg flex items-center justify-center text-2xl mb-1`}
                      >
                        {avatar.emoji}
                      </div>
                      <p className="text-xs font-medium text-green-700">{avatar.name}</p>
                      {formData.selectedAvatar === avatar.emoji && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {formData.selectedAvatar && (
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    Selected:{" "}
                    {avatarOptions.find((a) => a.emoji === formData.selectedAvatar)?.name || "Avatar"}
                  </Badge>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Create Account
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="w-full h-10 border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Skip for now - I'll add children later
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-green-600 text-sm">
                Want to add more children?{" "}
                <Link
                  href="/parent/dashboard"
                  className="text-green-700 hover:text-green-800 font-semibold transition-colors"
                >
                  You can do that from your dashboard!
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
