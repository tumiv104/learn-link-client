"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserProfileDTO } from "@/data/UserProfileDTO"
import { Loader2 } from "lucide-react"

interface ChildProfileDialogProps {
  open: boolean
  onClose: () => void
  child: UserProfileDTO | null
  loading: boolean
}

export default function ChildProfileDialog({ open, onClose, child, loading }: ChildProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Child Profile</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : child ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/avatars/${child.avatarUrl}`}
                alt={child.name}
                className="w-20 h-20 rounded-full border object-cover"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              />
              <div>
                <h3 className="text-lg font-semibold">{child.name}</h3>
                <p className="text-sm text-gray-600">{child.email}</p>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p><strong>Date of Birth:</strong> {child.dob ? new Date(child.dob).toLocaleDateString() : "—"}</p>
              <p><strong>Parent:</strong> {child.parentName || "—"}</p>
              <p><strong>Total Points:</strong> {child.totalPoints}</p>
              <p><strong>Joined:</strong> {new Date(child.createdAt!).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No data</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
