"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Star, Target, User, Clock, Gift, Paperclip, Link, Upload, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface MissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "view" | "edit"
  mission: any // Replace 'any' with the actual type of your mission object
  children: any[] // Replace 'any[]' with the actual type of your children array
  onSave: (data: any) => void // Replace 'any' with the actual type of your mission data
}

export function MissionDialog({ open, onOpenChange, mode, mission, children, onSave }: MissionDialogProps) {
  const [formData, setFormData] = useState({
    Title: mission?.Title || "",
    Description: mission?.Description || "",
    ChildId: mission?.ChildId || (children.length > 0 ? children[0].userId : null),
    Deadline: mission?.Deadline || new Date().toISOString().split("T")[0],
    Points: mission?.Points || 10,
    BonusPoints: mission?.BonusPoints || null,
    Promise: mission?.Promise || "",
    Status: mission?.Status || "Assigned",
    ChildName: mission?.ChildName || (children.length > 0 ? children[0].Name : null),
    CreatedAt: mission?.CreatedAt || new Date(),
    AttachmentUrl: mission?.AttachmentUrl || "",
  })

  const [attachmentType, setAttachmentType] = useState<"file" | "url">("url")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const isReadOnly = mode === "view"

  const title = mode === "create" ? "Create New Mission" : mode === "view" ? "View Mission Details" : "Edit Mission"

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // In a real app, you would upload the file to a server and get a URL
      setFormData({ ...formData, AttachmentUrl: "" })
    }
  }

  const handleSave = () => {
    const fd = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        fd.append(key, value.toString())
      }
    })

    if (selectedFile) {
      fd.append("AttachmentFile", selectedFile) // match với [FromForm] trong BE
    }

    onSave(formData)
    //onOpenChange(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Assigned":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getFileTypeIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <File className="w-4 h-4 text-red-500" />
      case "doc":
      case "docx":
        return <File className="w-4 h-4 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <File className="w-4 h-4 text-green-500" />
      case "zip":
      case "rar":
        return <File className="w-4 h-4 text-purple-500" />
      default:
        return <Link className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-2xl">
        <DialogHeader className="pb-6 border-b border-slate-200">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <div className="p-2 rounded-lg bg-blue-100">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            {title}
          </DialogTitle>
          {mode === "view" && (
            <DialogDescription className="mt-3">
              <Badge className={cn("px-3 py-1 font-medium border", getStatusColor(formData.Status))}>
                {formData.Status}
              </Badge>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="grid gap-8 py-6">
          <div className="grid gap-3">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mission Title
            </Label>
            <Input
              id="title"
              value={formData.Title}
              onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
              placeholder="Enter mission title"
              disabled={isReadOnly}
              className="h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              placeholder="Describe what needs to be done"
              rows={4}
              disabled={isReadOnly}
              className="text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* <div className="grid gap-4 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200"> */}
          <div className="grid gap-3">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Mission Attachment (Optional)
            </Label>

            {!isReadOnly && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={attachmentType === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setAttachmentType("url")
                    setSelectedFile(null)
                  }}
                  className="flex items-center gap-2"
                >
                  <Link className="w-4 h-4" />
                  URL Link
                </Button>
                <Button
                  type="button"
                  variant={attachmentType === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setAttachmentType("file")
                    setFormData({ ...formData, AttachmentUrl: "" })
                  }}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
              </div>
            )}

            {attachmentType === "url" ? (
              <div className="grid gap-2">
                <Input
                  value={formData.AttachmentUrl}
                  onChange={(e) => setFormData({ ...formData, AttachmentUrl: e.target.value })}
                  placeholder="https://example.com/resource or paste any link here"
                  disabled={isReadOnly}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <p className="text-xs text-slate-500">
                  Add a link to instructions, reference materials, or any online resource
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isReadOnly}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar,.txt,.ppt,.pptx,.xls,.xlsx"
                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Upload images, PDFs, Word docs, ZIP files, or any other file type
                </p>
                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <File className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
                    <span className="text-xs text-blue-600">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            )}

            {/* Show current attachment in view mode */}
            {isReadOnly && formData.AttachmentUrl && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                {getFileTypeIcon(formData.AttachmentUrl)}
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Mission Attachment</p>
                  <a
                    href={formData.AttachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {formData.AttachmentUrl}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="grid gap-3">
              <Label htmlFor="child" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assign to Child
              </Label>
              <Select
                value={formData.ChildId.toString()}
                onValueChange={(value) => setFormData({ ...formData, ChildId: Number.parseInt(value) })}
                disabled={isReadOnly}
              >
                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select a child" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.userId} value={child.userId.toString()}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{child.AvatarUrl}</span>
                        <span className="font-medium">{child.Name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="deadline" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.Deadline}
                onChange={(e) => setFormData({ ...formData, Deadline: e.target.value })}
                disabled={isReadOnly}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="points" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Points Reward
              </Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={formData.Points}
                onChange={(e) => setFormData({ ...formData, Points: Number.parseInt(e.target.value) || 0 })}
                disabled={isReadOnly}
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="promise" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Gift className="w-4 h-4 text-pink-500" />
              Special Promise (Optional)
            </Label>
            <Input
              id="promise"
              value={formData.Promise || ""}
              onChange={(e) => setFormData({ ...formData, Promise: e.target.value })}
              placeholder="e.g., Extra story time if completed early"
              disabled={isReadOnly}
              className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          {mode === "view" && (
            <div className="grid gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-lg flex items-center gap-3 text-slate-800">
                <div className="p-2 rounded-lg bg-blue-100">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Mission Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Assigned to:</span>
                  <p className="font-semibold text-slate-800 text-lg">{formData.ChildName}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Created:</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {formData.CreatedAt ? new Date(formData.CreatedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Total Reward:</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    <span className="text-lg">{formData.Points + (formData.BonusPoints || 0)} points</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Deadline:</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {new Date(formData.Deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 border-t border-slate-200 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 h-11 border-slate-300 hover:bg-slate-50"
          >
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button
              onClick={handleSave}
              className="px-6 py-2 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
            >
              {mode === "create" ? "Create Mission" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
