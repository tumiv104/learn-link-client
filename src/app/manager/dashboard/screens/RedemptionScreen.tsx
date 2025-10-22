import { RedemptionStatusDialog } from "@/components/dashboard/manager/RedemptionStatusDialog";
import { AlertPopup } from "@/components/ui/alert-popup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RedemptionResponse } from "@/data/shop";
import { useAlert } from "@/hooks/useAlert";
import { getAllRedemption, updateStatus } from "@/services/points/pointService";
import { CheckCircle, Clock, Search, Store, Truck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function RedemptionScreen() {
  const { alert, showSuccess, showError, hideAlert } = useAlert()
  
  const [redemptions, setRedemptions] = useState<RedemptionResponse[]>([])
  const [filteredRedemptions, setFilteredRedemptions] = useState<RedemptionResponse[]>([])
  const [redemptionSearchQuery, setRedemptionSearchQuery] = useState("")
  const [filterRedemptionStatus, setFilterRedemptionStatus] = useState<string>("All")
  const [selectedRedemption, setSelectedRedemption] = useState<RedemptionResponse | null>(null)
  const [isRedemptionDialogOpen, setIsRedemptionDialogOpen] = useState(false)
  const [redemptionCurrentPage, setRedemptionCurrentPage] = useState(1)
  const [redemptionItemsPerPage, setRedemptionItemsPerPage] = useState(10)

  const fetchRedemption = async () => {
    try {
      const res = await getAllRedemption();
      setRedemptions(res.data)
    setFilteredRedemptions(res.data)
    } catch {
      console.log("fetch data fail.")
    }
  }

  useEffect(() => {
    fetchRedemption();
  }, [])

  useEffect(() => {
    let filtered = redemptions.filter(
      (redemption) =>
        redemption.productName.toLowerCase().includes(redemptionSearchQuery.toLowerCase()) ||
        redemption.childName.toLowerCase().includes(redemptionSearchQuery.toLowerCase()) ||
        redemption.shopName.toLowerCase().includes(redemptionSearchQuery.toLowerCase()),
    )

    if (filterRedemptionStatus !== "All") {
      filtered = filtered.filter((redemption) => redemption.status === filterRedemptionStatus)
    }

    setFilteredRedemptions(filtered)
    setRedemptionCurrentPage(1)
  }, [redemptionSearchQuery, filterRedemptionStatus, redemptions])

  const redemptionTotalPages = Math.ceil(filteredRedemptions.length / redemptionItemsPerPage)
  const redemptionStartIndex = (redemptionCurrentPage - 1) * redemptionItemsPerPage
  const redemptionEndIndex = redemptionStartIndex + redemptionItemsPerPage
  const currentRedemptions = filteredRedemptions.slice(redemptionStartIndex, redemptionEndIndex)

  const handleUpdateRedemptionStatus = async (redemptionId: number, newStatus: string, note?: string) => {
    try {
      const res = await updateStatus(redemptionId, newStatus)
      if (res.success) {
        setRedemptions(redemptions.map((r) => (r.redemptionId === redemptionId ? { ...r, status: newStatus } : r)))
        showSuccess("success", `Redemption status updated to ${newStatus}!`)
      } else {
        showError("error", res.message)
      }
    } catch (error) {
      showError("error", "Failed to update redemption status. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case "Confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        )
      case "Delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Truck className="w-3 h-3 mr-1" />
            Delivered
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        )
      default:
        return null
    }
  }
    return (
        <div className="space-y-6">
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
            <RedemptionStatusDialog
            isOpen={isRedemptionDialogOpen}
            onClose={() => setIsRedemptionDialogOpen(false)}
            onUpdateStatus={handleUpdateRedemptionStatus}
            redemption={selectedRedemption}
            />
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search by product, child, or shop..."
                      value={redemptionSearchQuery}
                      onChange={(e) => setRedemptionSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterRedemptionStatus}
                    onChange={(e) => setFilterRedemptionStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Child
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRedemptions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No redemptions found.
                        </td>
                      </tr>
                    ) : (
                      currentRedemptions.map((redemption) => (
                        <tr key={redemption.redemptionId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={redemption.productImage || "/placeholder.svg"}
                                alt={redemption.productName}
                                className="w-12 h-12 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                                }}
                              />
                              <div className="text-sm font-medium text-gray-900">{redemption.productName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{redemption.childName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <Store className="w-4 h-4 mr-2 text-gray-400" />
                              {redemption.shopName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-blue-600">{redemption.pointsSpent} pts</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {new Date(redemption.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(redemption.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRedemption(redemption)
                                setIsRedemptionDialogOpen(true)
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              Update Status
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filteredRedemptions.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                      Showing {redemptionStartIndex + 1} to {Math.min(redemptionEndIndex, filteredRedemptions.length)}{" "}
                      of {filteredRedemptions.length} redemptions
                    </span>
                    <select
                      value={redemptionItemsPerPage}
                      onChange={(e) => {
                        setRedemptionItemsPerPage(Number(e.target.value))
                        setRedemptionCurrentPage(1)
                      }}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={15}>15 per page</option>
                      <option value={20}>20 per page</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRedemptionCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={redemptionCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: redemptionTotalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={redemptionCurrentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRedemptionCurrentPage(page)}
                        className={redemptionCurrentPage === page ? "bg-blue-600" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRedemptionCurrentPage((p) => Math.min(redemptionTotalPages, p + 1))}
                      disabled={redemptionCurrentPage === redemptionTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
    );
}