"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Package, ImageIcon } from "lucide-react"

interface Product {
  productId: number
  shopId: number
  name: string
  description: string
  imageUrl: string
  pricePoints: number
  stock: number
  isActive: boolean
  createdAt: string
}

interface Shop {
  shopId: number
  shopName: string
}

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (productData: Partial<Product>) => void
  product: Product | null
  mode: "create" | "edit" | "view"
  shops: Shop[]
}

export function ProductDialog({ isOpen, onClose, onSave, product, mode, shops }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    shopId: 0,
    name: "",
    description: "",
    imageUrl: "",
    pricePoints: 0,
    stock: 0,
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product && (mode === "edit" || mode === "view")) {
      setFormData({
        shopId: product.shopId,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        pricePoints: product.pricePoints,
        stock: product.stock,
        isActive: product.isActive,
      })
    } else {
      setFormData({
        shopId: shops.length > 0 ? shops[0].shopId : 0,
        name: "",
        description: "",
        imageUrl: "",
        pricePoints: 0,
        stock: 0,
        isActive: true,
      })
    }
    setErrors({})
  }, [product, mode, isOpen, shops])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.shopId) newErrors.shopId = "Shop is required"
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required"
    if (formData.pricePoints <= 0) newErrors.pricePoints = "Price points must be greater than 0"
    if (formData.stock < 0) newErrors.Stock = "Stock cannot be negative"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (mode === "view") {
      onClose()
      return
    }

    if (validate()) {
      onSave(formData)
    }
  }

  const isViewMode = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {mode === "create" ? "Add New Product" : mode === "edit" ? "Edit Product" : "Product Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Shop Selection */}
          <div className="space-y-2">
            <Label htmlFor="shopId">Shop *</Label>
            <select
              id="shopId"
              value={formData.shopId}
              onChange={(e) => setFormData({ ...formData, shopId: Number(e.target.value) })}
              disabled={isViewMode}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={0}>Select a shop</option>
              {shops.map((shop) => (
                <option key={shop.shopId} value={shop.shopId}>
                  {shop.shopName}
                </option>
              ))}
            </select>
            {errors.shopId && <p className="text-sm text-red-600">{errors.shopId}</p>}
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              disabled={isViewMode}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={4}
              disabled={isViewMode}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <div className="flex gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400 mt-2" />
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={isViewMode}
                className="flex-1"
              />
            </div>
            {errors.imageUrl && <p className="text-sm text-red-600">{errors.imageUrl}</p>}
            {formData.imageUrl && (
              <div className="mt-2 border rounded-md p-2">
                <img
                  src={formData.imageUrl || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
              </div>
            )}
          </div>

          {/* Price Points and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePoints">Price Points *</Label>
              <Input
                id="pricePoints"
                type="number"
                value={formData.pricePoints}
                onChange={(e) => setFormData({ ...formData, pricePoints: Number(e.target.value) })}
                placeholder="0"
                min="0"
                disabled={isViewMode}
              />
              {errors.pricePoints && <p className="text-sm text-red-600">{errors.pricePoints}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
                min="0"
                disabled={isViewMode}
              />
              {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <Label htmlFor="isActive" className="text-base">
                Active Status
              </Label>
              <p className="text-sm text-gray-500">Product is available for redemption</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              disabled={isViewMode}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              {mode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
