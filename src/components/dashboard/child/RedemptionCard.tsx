import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import Image from "next/image"
import { RedemptionResponse } from "@/data/shop"

interface RedemptionCardProps {
  redemption: RedemptionResponse
}

export function RedemptionCard({ redemption }: RedemptionCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          icon: <Clock className="w-6 h-6" />,
          color: "from-yellow-400 to-orange-400",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300",
          textColor: "text-yellow-700",
          label: "⏳ Waiting for Confirmation",
          emoji: "⏳",
        }
      case "Confirmed":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: "from-blue-400 to-cyan-400",
          bgColor: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-300",
          textColor: "text-blue-700",
          label: "✅ Confirmed! Getting Ready",
          emoji: "📦",
        }
      case "Delivered":
        return {
          icon: <Truck className="w-6 h-6" />,
          color: "from-green-400 to-emerald-400",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          textColor: "text-green-700",
          label: "🎉 Delivered! Enjoy!",
          emoji: "🎁",
        }
      case "Cancelled":
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: "from-red-400 to-pink-400",
          bgColor: "from-red-50 to-pink-50",
          borderColor: "border-red-300",
          textColor: "text-red-700",
          label: "❌ Cancelled",
          emoji: "😢",
        }
      default:
        return {
          icon: <Package className="w-6 h-6" />,
          color: "from-gray-400 to-slate-400",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300",
          textColor: "text-gray-700",
          label: "Unknown",
          emoji: "❓",
        }
    }
  }

  const statusConfig = getStatusConfig(redemption.status)
  const orderDate = new Date(redemption.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card
      className={`border-4 ${statusConfig.borderColor} bg-gradient-to-br ${statusConfig.bgColor} hover:shadow-xl transition-all duration-300 transform hover:scale-102 overflow-hidden`}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Product Image */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            {redemption.productImage ? (
              <Image
                src={redemption.productImage || "/placeholder.svg"}
                alt={redemption.productName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <Package className="w-12 h-12 text-purple-400" />
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="flex-1 space-y-2">
            {/* Product Name */}
            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{redemption.productName}</h3>

            {/* Shop Name */}
            <Badge variant="outline" className="text-xs border-purple-300 text-purple-600">
              🏪 {redemption.shopName}
            </Badge>

            {/* Points Spent */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Spent:</span>
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg border-2 border-yellow-300">
                <span className="text-yellow-600 font-bold">{redemption.pointsSpent}</span>
                <span className="text-xs text-yellow-600">⭐ points</span>
              </div>
            </div>

            {/* Order Date */}
            <p className="text-xs text-gray-500">📅 Ordered: {orderDate}</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`bg-gradient-to-r ${statusConfig.color} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/30 p-2 rounded-full">{statusConfig.icon}</div>
            <div>
              <p className="text-white font-bold text-lg">{statusConfig.label}</p>
            </div>
          </div>
          <div className="text-4xl animate-bounce">{statusConfig.emoji}</div>
        </div>
      </CardContent>
    </Card>
  )
}
