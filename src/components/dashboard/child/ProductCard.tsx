"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Package, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface ProductCardProps {
  product: {
    productId: number
    name: string
    description: string
    imageUrl: string
    pricePoints: number
    stock: number
    shopName: string
  }
  userPoints: number
  onPurchase: (product: any) => void
}

export function ProductCard({ product, userPoints, onPurchase }: ProductCardProps) {
  const t = useTranslations("childDashboard.shop")
  const canAfford = userPoints >= product.pricePoints
  const inStock = product.stock > 0

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-purple-200 bg-gradient-to-br from-white to-purple-50 overflow-hidden">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-24 h-24 text-purple-300" />
            </div>
          )}

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white animate-pulse">
              {t("product.onlyLeft", { count: product.stock })}
            </Badge>
          )}

          {!inStock && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white">
              {t("product.soldOut")}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Shop Name */}
          <Badge variant="outline" className="text-xs border-purple-300 text-purple-600">
            🏪 {product.shopName}
          </Badge>

          {/* Product Name */}
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{product.description}</p>

          {/* Price */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 border-2 border-yellow-300">
            <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
            <span className="text-2xl font-black text-yellow-700">{product.pricePoints}</span>
            <span className="text-sm font-bold text-yellow-600">{t("product.points")}</span>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={() => onPurchase(product)}
            disabled={!canAfford || !inStock}
            className={`w-full text-lg font-bold py-6 rounded-xl transition-all duration-300 ${
              !canAfford || !inStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {!inStock ? (
              <>❌ {t("product.soldOut")}</>
            ) : !canAfford ? (
              <>💰 {t("product.needMore", { count: product.pricePoints - userPoints })}</>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t("product.buyNow")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
