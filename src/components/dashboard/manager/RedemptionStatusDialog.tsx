"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Package, CheckCircle, XCircle, Truck } from "lucide-react"
import { RedemptionResponse } from "@/data/shop"

interface RedemptionStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (redemptionId: number, newStatus: string, note?: string) => void
  redemption: RedemptionResponse | null
}

export function RedemptionStatusDialog({ isOpen, onClose, onUpdateStatus, redemption }: RedemptionStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (redemption) {
      setSelectedStatus(redemption.status)
      setNote("")
    }
  }, [redemption])

  const handleSubmit = () => {
    if (redemption && selectedStatus) {
      onUpdateStatus(redemption.redemptionId, selectedStatus, note)
      onClose()
    }
  }

  if (!redemption) return null

  const statusOptions = [
    { value: "Pending", label: "Pending", icon: Package, color: "text-yellow-600" },
    { value: "Confirmed", label: "Confirmed", icon: CheckCircle, color: "text-blue-600" },
    { value: "Delivered", label: "Delivered", icon: Truck, color: "text-green-600" },
    { value: "Cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Redemption Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Redemption Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-4">
              <img
                src={redemption.productImage || "/placeholder.svg"}
                alt={redemption.productName}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{redemption.productName}</h3>
                <p className="text-sm text-gray-600">{redemption.shopName}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Child: <span className="font-medium">{redemption.childName}</span>
                  </span>
                  <span className="text-blue-600 font-medium">{redemption.pointsSpent} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select New Status</label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      selectedStatus === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${option.color}`} />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes about this status change..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedStatus} className="bg-blue-600 hover:bg-blue-700">
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
