"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Zap, Users, AlertCircle, Check } from "lucide-react"
import { useTranslations } from "next-intl"

interface PremiumUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpgrade: () => void
  loading?: boolean
  isPremium?: boolean
  premiumExpiry?: string
}

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  onUpgrade,
  loading = false,
  isPremium = false,
  premiumExpiry,
}: PremiumUpgradeDialogProps) {
  const t = useTranslations("premiumDialog")

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: t("benefits.unlimitedMissions"),
      description: t("benefits.unlimitedMissionsDesc"),
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: t("benefits.unlimitedChildren"),
      description: t("benefits.unlimitedChildrenDesc"),
    },
  ]

  if (isPremium) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[75vh] bg-white border-0 shadow-2xl p-0 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold text-white">{t("premiumStatus.title")}</DialogTitle>
                <p className="text-purple-100 mt-1">{t("premiumStatus.subtitle")}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Premium Status Card */}
            <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">{t("premiumStatus.active")}</p>
                    <p className="text-sm text-green-600">
                      {premiumExpiry
                        ? `${t("premiumStatus.expiry")}: ${new Date(premiumExpiry).toLocaleDateString()}`
                        : t("premiumStatus.noExpiry")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t("benefitsTitle")}</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">{benefit.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-800">{benefit.title}</p>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1 py-3 text-base bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold shadow-xl"
              >
                {t("premiumStatus.close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[75vh] bg-white border-0 shadow-2xl p-0 overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold text-white">{t("title")}</DialogTitle>
              <p className="text-purple-100 mt-1">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Price Card */}
          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-purple-700">99,000</span>
                <span className="text-lg text-gray-600"> {t("priceUnit")}</span>
              </div>
              <p className="text-sm text-gray-600">{t("priceDescription")}</p>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t("benefitsTitle")}</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg text-purple-600">{benefit.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{benefit.title}</p>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 text-sm">{t("infoTitle")}</p>
              <p className="text-blue-800 text-sm">{t("infoDescription")}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 text-base border-2 hover:bg-gray-50"
              disabled={loading}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={onUpgrade}
              disabled={loading}
              className="flex-1 py-3 text-base bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold shadow-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("actions.processing")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {t("actions.upgrade")}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
