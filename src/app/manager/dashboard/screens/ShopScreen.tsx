import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Store, Eye, Edit, Trash2, XCircle, CheckCircle, Globe, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createShop, editShop, getAllShop } from "@/services/shop/shopService";
import { ShopDialog } from "@/components/dashboard/manager/ShopDialog";
import { useAlert } from "@/hooks/useAlert";
import { ShopRequest } from "@/data/shop";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AlertPopup } from "@/components/ui/alert-popup";

interface Shop {
  shopId: number
  shopName: string
  contactInfo: string
  website: string
  isActive: boolean
}

export default function ShopScreen() {
  const [shops, setShops] = useState<Shop[]>([])
  const [filteredShops, setFilteredShops] = useState<Shop[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteShop, setDeleteShop] = useState<Shop | null>(null)
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [filterShopId, setFilterShopId] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchShop = async () => {
    try {
      const res = await getAllShop();
      setShops(res.data)
      setFilteredShops(res.data)
    } catch {
      console.log("fetch data fail.")
    }
  }

  useEffect(() => {
    fetchShop();
  }, [])

  useEffect(() => {
    const filtered = shops.filter(
      (shop) =>
        (shop?.shopName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shop?.contactInfo ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shop?.website ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredShops(filtered)
    setCurrentPage(1)
  }, [searchQuery, shops])

  const totalPages = Math.ceil(filteredShops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentShops = filteredShops.slice(startIndex, endIndex)

  const handleCreateShop = () => {
    setDialogMode("create")
    setSelectedShop(null)
    setIsDialogOpen(true)
  }

  const handleEditShop = (shop: Shop) => {
    setDialogMode("edit")
    setSelectedShop(shop)
    setIsDialogOpen(true)
  }

  const handleViewShop = (shop: Shop) => {
    setDialogMode("view")
    setSelectedShop(shop)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (shop: Shop) => {
    setDeleteShop(shop)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteShop) return

    try {
      setShops(shops.filter((s) => s.shopId !== deleteShop.shopId))
      showSuccess("success", "Shop deleted successfully!")
      setDeleteShop(null)
    } catch (error) {
      showError("error", "Failed to delete shop. Please try again.")
    }
  }

  const handleSaveShop = async (shopData: Partial<ShopRequest>) => {
      const newShop: ShopRequest = {
            shopName: shopData.shopName!,
            contactInfo: shopData.contactInfo!,
            website: shopData.website!,
            isActive: shopData.isActive ?? true,
          }
      try {
        if (dialogMode === "create") {
          
          const res = await createShop(newShop);
          if (res.success) {
            setShops([...shops, res.data])
            showSuccess("success", "Shop created successfully!")
          }
          
        } else if (dialogMode === "edit" && selectedShop) {
          const res = await editShop(selectedShop.shopId, newShop);
          if (res.success) {
            setShops(shops.map((s) => (s.shopId === selectedShop.shopId ? { ...s, ...res.data } : s)))
            showSuccess("success", "Shop updated successfully!")
          }
        }
        setIsDialogOpen(false)
      } catch (error) {
        showError("error", "Failed to save shop. Please try again.")
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
        <ShopDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveShop}
        shop={selectedShop}
        mode={dialogMode}
        />
        <ConfirmationDialog
        open={!!deleteShop}
        onOpenChange={() => setDeleteShop(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Shop"
        description={`Are you sure you want to delete "${deleteShop?.shopName}"? This action cannot be undone.`}
        variant="warning"
        />
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search shops by name, contact, or website..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleCreateShop} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Shop
                </Button>
              </div>
            </Card>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shop Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Website
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
                    {currentShops.length === 0 ? (
                      <tr key="no-shops">
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No shops found. Create your first shop to get started.
                        </td>
                      </tr>
                    ) : (
                      currentShops.map((shop, index) => (
                        <tr key={shop?.shopId ?? `shop-${index}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Store className="w-5 h-5 text-gray-400 mr-3" />
                              <span className="text-sm font-medium text-gray-900">{shop.shopName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {shop.contactInfo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={shop.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              {shop.website}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {shop.isActive ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewShop(shop)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditShop(shop)}
                                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(shop)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filteredShops.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredShops.length)} of {filteredShops.length}{" "}
                      shops
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
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
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-blue-600" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
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
