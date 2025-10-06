"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, Phone, Globe, ToggleLeft, ToggleRight } from "lucide-react"

interface Shop {
  shopId: number
  shopName: string
  contactInfo: string
  website: string
  isActive: boolean
}

interface ShopDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (shop: Partial<Shop>) => void
  shop: Shop | null
  mode: "create" | "edit" | "view"
}

export function ShopDialog({ isOpen, onClose, onSave, shop, mode }: ShopDialogProps) {
  const [formData, setFormData] = useState({
    shopName: "",
    contactInfo: "",
    website: "",
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (shop && (mode === "edit" || mode === "view")) {
      setFormData({
        shopName: shop.shopName,
        contactInfo: shop.contactInfo,
        website: shop.website,
        isActive: shop.isActive,
      })
    } else {
      setFormData({
        shopName: "",
        contactInfo: "",
        website: "",
        isActive: true,
      })
    }
    setErrors({})
  }, [shop, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required"
    }

    if (!formData.contactInfo.trim()) {
      newErrors.ContactInfo = "Contact info is required"
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required"
    } else if (!/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Please enter a valid URL (starting with http:// or https://)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return

    if (validateForm()) {
      onSave(formData)
    }
  }

  const isViewMode = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Store className="w-5 h-5 text-blue-600" />
            {mode === "create" && "Create New Shop"}
            {mode === "edit" && "Edit Shop"}
            {mode === "view" && "Shop Details"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Shop Name */}
          <div className="space-y-2">
            <Label htmlFor="shopName" className="text-sm font-medium">
              Shop Name *
            </Label>
            <Input
              id="shopName"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder="Enter shop name"
              disabled={isViewMode}
              className={errors.shopName ? "border-red-500" : ""}
            />
            {errors.shopName && <p className="text-sm text-red-500">{errors.shopName}</p>}
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <Label htmlFor="contactInfo" className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Info *
            </Label>
            <Input
              id="contactInfo"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="Enter phone number or email"
              disabled={isViewMode}
              className={errors.contactInfo ? "border-red-500" : ""}
            />
            {errors.contactInfo && <p className="text-sm text-red-500">{errors.contactInfo}</p>}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website *
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
              disabled={isViewMode}
              className={errors.website ? "border-red-500" : ""}
            />
            {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <button
              type="button"
              onClick={() => !isViewMode && setFormData({ ...formData, isActive: !formData.isActive })}
              disabled={isViewMode}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                formData.isActive ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
              } ${!isViewMode && "hover:shadow-md cursor-pointer"}`}
            >
              {formData.isActive ? (
                <ToggleRight className="w-6 h-6 text-green-600" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400" />
              )}
              <div className="text-left">
                <div className="font-medium text-sm">{formData.isActive ? "Active" : "Inactive"}</div>
                <div className="text-xs text-gray-500">
                  {formData.isActive ? "Shop is visible to users" : "Shop is hidden from users"}
                </div>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {mode === "create" ? "Create Shop" : "Save Changes"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
