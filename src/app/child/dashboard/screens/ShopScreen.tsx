"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { ProductCard } from "@/components/dashboard/child/ProductCard"
import { RedemptionCard } from "@/components/dashboard/child/RedemptionCard"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useEffect, useState } from "react"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllProduct } from "@/services/shop/shopService"
import { ProductResponse, RedemptionResponse } from "@/data/shop"
import { UserDto } from "@/services/auth/authService"
import { getAllChildRedemption, redeemProduct } from "@/services/points/pointService"

interface ShopProps {
  user: UserDto | null
  points: number
}

export default function ShopScreen({ user, points }: ShopProps) {
  const t = useTranslations("childDashboard.shop")
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [redemptions, setRedemptions] = useState<RedemptionResponse[]>([])
  const { alert, showSuccess, showError, hideAlert } = useAlert()
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "destructive" as "destructive" | "success" | "warning",
  })

  const fetchProduct = async () => {
    try {
      const res = await getAllProduct()
      setProducts(res.data)
    } catch {
      console.log("fetch data fail.")
    }
  }

  const fetchRedemption = async () => {
    try {
      const res = await getAllChildRedemption()
      setRedemptions(res.data)
    } catch {
      console.log("fetch data fail.")
    }
  }

  useEffect(() => {
    fetchProduct()
    fetchRedemption()
  }, [])

  const handlePurchaseProduct = (product: any) => {
    setConfirmDialog({
      open: true,
      title: t("dialog.buyTitle"),
      description: t("dialog.buyDescription", { points: product.pricePoints, name: product.name }),
      variant: "success",
      onConfirm: async () => {
        try {
          if (user?.id) {
            const res = await redeemProduct(user.id, product.productId)
            if (res.success) {
              showSuccess("success", t("dialog.success", { name: product.name }))
            } else {
              showError("error", res.message)
            }
          }
        } catch (error) {
          showError("error", t("dialog.startError"))
        }
      },
    })
  }

  return (
    <div className="space-y-6 pb-24">
      {alert && (
        <div className="mb-6">
          <AlertPopup
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={hideAlert}
          />
        </div>
      )}

      {/* Header */}
      <div className="text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-8 rounded-3xl shadow-2xl">
        <div className="text-8xl animate-bounce mb-4">🏪</div>
        <h2 className="text-5xl font-black text-white drop-shadow-lg mb-2">
          {t("header.title")}
        </h2>
        <p className="text-white text-xl font-bold">{t("header.subtitle")}</p>

        {/* Points Display */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border-4 border-white/30">
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-yellow-300 animate-pulse" />
              <div>
                <div className="text-3xl font-black text-white">{points}</div>
                <div className="text-sm text-white/80">{t("header.pointsLabel")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-16 bg-gradient-to-r from-purple-200 to-pink-200 p-2 rounded-2xl border-4 border-purple-300">
          <TabsTrigger
            value="products"
            className="text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {t("tabs.shop")}
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl"
          >
            <Package className="w-5 h-5 mr-2" />
            {t("tabs.orders")}
          </TabsTrigger>
        </TabsList>

        {/* Products */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                userPoints={points}
                onPurchase={handlePurchaseProduct}
              />
            ))}
          </div>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-6">
          {redemptions.length === 0 ? (
            <Card className="border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-12 text-center">
                <div className="text-8xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t("orders.emptyTitle")}</h3>
                <p className="text-gray-600 mb-6">{t("orders.emptyDescription")}</p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-6 rounded-xl">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {t("orders.emptyButton")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {redemptions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((redemption) => (
                  <RedemptionCard key={redemption.redemptionId} redemption={redemption} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  )
}
