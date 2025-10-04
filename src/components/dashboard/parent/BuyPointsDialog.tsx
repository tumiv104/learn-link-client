"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, CreditCard, Smartphone, Wallet, AlertCircle, ShoppingCart, Star, Zap } from "lucide-react"

interface BuyPointsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchase: (points: number, paymentMethod: string) => void
}

const paymentMethods = [
  {
    id: "momo",
    name: "Momo",
    icon: <Smartphone className="w-6 h-6" />,
    description: "Pay with Momo e-wallet",
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
    borderColor: "border-pink-200",
    popular: true,
  },
  {
    id: "vnpay",
    name: "VNPAY",
    icon: <CreditCard className="w-6 h-6" />,
    description: "Pay with VNPAY gateway",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    popular: false,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: <Wallet className="w-6 h-6" />,
    description: "Direct bank transfer",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    borderColor: "border-green-200",
    popular: false,
  },
]

const pointPackages = [
  { points: 10, bonus: 0, popular: false },
  { points: 50, bonus: 5, popular: false },
  { points: 100, bonus: 15, popular: true },
  { points: 500, bonus: 100, popular: false },
]

export function BuyPointsDialog({ open, onOpenChange, onPurchase }: BuyPointsDialogProps) {
  const [points, setPoints] = useState(100)
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [loading, setLoading] = useState(false)

  const totalCost = points * 1000 // 1 point = 1000 VND
  const minPoints = 10

  const handlePurchase = async () => {
    if (points < minPoints) return

    setLoading(true)
    try {
      await onPurchase(points, paymentMethod)
      onOpenChange(false)
      setPoints(10)
      setPaymentMethod("momo")
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePackageSelect = (packagePoints: number) => {
    setPoints(packagePoints)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white border-0 shadow-2xl p-0 overflow-hidden">
        <div className="flex">
          {/* Left Side - Points Selection */}
          <div className="flex-1 p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
            <DialogHeader className="text-center pb-4">
              {/* <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mb-3 shadow-xl">
                <Coins className="w-8 h-8 text-white" />
              </div> */}
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Buy Points
              </DialogTitle>
              <p className="text-gray-600 mt-1 text-base">Choose your points package</p>
            </DialogHeader>

            {/* Quick Package Selection */}
            <div className="space-y-3 mb-4">
              <Label className="text-base font-semibold text-gray-800">Popular Packages</Label>
              <div className="grid grid-cols-2 gap-2">
                {pointPackages.map((pkg) => (
                  <Card
                    key={pkg.points}
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                      points === pkg.points
                        ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md"
                        : "border-gray-200 hover:border-amber-300"
                    } ${pkg.popular ? "" : ""}`}
                    onClick={() => handlePackageSelect(pkg.points)}
                  >
                    <CardContent className="p-3 text-center relative">
                      {pkg.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Popular
                        </div>
                      )}
                      <div className="text-xl font-bold text-amber-600">{pkg.points}</div>
                      <div className="text-sm text-gray-600">points</div>
                      {pkg.bonus > 0 && (
                        <div className="text-xs text-green-600 font-semibold mt-1 flex items-center justify-center gap-1">
                          <Zap className="w-3 h-3" />+{pkg.bonus} bonus
                        </div>
                      )}
                      <div className="text-sm font-semibold text-gray-800 mt-1">
                        {(pkg.points * 1000).toLocaleString()} VND
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-3">
              <Label htmlFor="points" className="text-base font-semibold text-gray-800">
                Custom Amount
              </Label>
              <div className="relative">
                <Input
                  id="points"
                  type="number"
                  min={minPoints}
                  value={points}
                  onChange={(e) => setPoints(Math.max(minPoints, Number.parseInt(e.target.value) || minPoints))}
                  className="pl-10 pr-4 py-3 text-lg font-bold border-2 border-gray-300 focus:border-amber-400 rounded-xl bg-white/80 backdrop-blur-sm"
                  placeholder={`Min ${minPoints}`}
                />
                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
              </div>
              {points < minPoints && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Minimum purchase is {minPoints} points</span>
                </div>
              )}
            </div>

            {/* Cost Summary */}
            <Card className="mt-4 bg-gradient-to-r from-amber-100 via-orange-100 to-red-100 border-2 border-amber-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">You're buying</p>
                    <p className="text-2xl font-bold text-amber-700">{points} points</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700 font-medium">Total cost</p>
                    <p className="text-2xl font-bold text-orange-700">{totalCost.toLocaleString()} VND</p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 bg-white/60 rounded-lg p-2">
                  Rate: 1,000 VND per point
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Payment Methods */}
          <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="mb-6 mt-10">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Method</h3>
              <p className="text-gray-600">Choose how you'd like to pay</p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                  <Label
                    htmlFor={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                      paymentMethod === method.id
                        ? `${method.borderColor} ${method.bgColor} shadow-lg ring-2 ring-opacity-20`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {method.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Recommended
                      </div>
                    )}
                    <div className={`p-3 rounded-lg ${method.bgColor} ${method.borderColor} border`}>
                      <div className={method.color}>{method.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base text-gray-800">{method.name}</p>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 font-medium">Instant processing</span>
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Secure Payment</p>
                  <p className="text-blue-700 text-sm">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 py-3 text-base border-2 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={points < minPoints || loading}
                className="flex-1 py-3 text-base bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Purchase
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
