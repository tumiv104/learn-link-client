"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Store,
  LogOut,
  Edit,
  Trash2,
  Eye,
  Globe,
  Phone,
  CheckCircle,
  XCircle,
  Package,
  Clock,
  Truck,
  ShoppingBag,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react"
import { ShopDialog } from "@/components/dashboard/manager/ShopDialog"
import { ProductDialog } from "@/components/dashboard/manager/ProductDialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useAlert } from "@/hooks/useAlert"
import { AlertPopup } from "@/components/ui/alert-popup"
import { createProduct, createShop, editProduct, editShop, getAllProduct, getAllShop } from "@/services/shop/shopService"
import { Product, ProductRequest, RedemptionResponse, ShopRequest } from "@/data/shop"
import { RedemptionStatusDialog } from "@/components/dashboard/manager/RedemptionStatusDialog"
import { getAllRedemption, updateStatus } from "@/services/points/pointService"
import { OverviewWidgets } from "@/components/dashboard/manager/OverviewWidgets"
import { UserDetailsList } from "@/components/dashboard/manager/UserDetailsList"
import { TaskPerformanceList } from "@/components/dashboard/manager/TaskPerformanceList"
import ShopScreen from "./screens/ShopScreen"
import OverviewScreen from "./screens/OverviewScreen"
import UserDetailScreen from "./screens/UserDetailScreen"
import PerformanceScreen from "./screens/PerformanceScreen"
import ProductScreen from "./screens/ProductScreen"
import RedemptionScreen from "./screens/RedemptionScreen"
import useRequireAuth from "@/hooks/useRequireAuth"
import { logout } from "@/services/auth/authService"
import { useRouter } from "next/navigation"

interface Shop {
  shopId: number
  shopName: string
  contactInfo: string
  website: string
  isActive: boolean
}

export default function ManagerDashboard() {
  const { user, loading, ready } = useRequireAuth("/auth/login", ["Admin"])
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [shops, setShops] = useState<Shop[]>([])
  const [filteredShops, setFilteredShops] = useState<Shop[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteShop, setDeleteShop] = useState<Shop | null>(null)
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productDialogMode, setProductDialogMode] = useState<"create" | "edit" | "view">("create")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [filterShopId, setFilterShopId] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [productCurrentPage, setProductCurrentPage] = useState(1)
  const [productItemsPerPage, setProductItemsPerPage] = useState(10)
  
  const [redemptions, setRedemptions] = useState<RedemptionResponse[]>([])
  const [filteredRedemptions, setFilteredRedemptions] = useState<RedemptionResponse[]>([])
  const [redemptionSearchQuery, setRedemptionSearchQuery] = useState("")
  const [filterRedemptionStatus, setFilterRedemptionStatus] = useState<string>("All")
  const [selectedRedemption, setSelectedRedemption] = useState<RedemptionResponse | null>(null)
  const [isRedemptionDialogOpen, setIsRedemptionDialogOpen] = useState(false)
  const [redemptionCurrentPage, setRedemptionCurrentPage] = useState(1)
  const [redemptionItemsPerPage, setRedemptionItemsPerPage] = useState(10)

  const fetchShop = async () => {
    try {
      const res = await getAllShop();
      setShops(res.data)
      setFilteredShops(res.data)
    } catch {
      console.log("fetch data fail.")
    }
  }

  const fetchProduct = async () => {
    try {
      const res = await getAllProduct();
      setProducts(res.data)
      setFilteredProducts(res.data)
    } catch {
      console.log("fetch data fail.")
    }
  }

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
    fetchShop();
    fetchProduct();
    fetchRedemption();
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

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        (product?.name ?? "").toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        (product?.description ?? "").toLowerCase().includes(productSearchQuery.toLowerCase())
    )

    if (filterShopId > 0) {
      filtered = filtered.filter((product) => product.shopId === filterShopId)
    }

    setFilteredProducts(filtered)
    setProductCurrentPage(1)
  }, [productSearchQuery, filterShopId, products])

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

  const totalPages = Math.ceil(filteredShops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentShops = filteredShops.slice(startIndex, endIndex)

  const productTotalPages = Math.ceil(filteredProducts.length / productItemsPerPage)
  const productStartIndex = (productCurrentPage - 1) * productItemsPerPage
  const productEndIndex = productStartIndex + productItemsPerPage
  const currentProducts = filteredProducts.slice(productStartIndex, productEndIndex)

  const redemptionTotalPages = Math.ceil(filteredRedemptions.length / redemptionItemsPerPage)
  const redemptionStartIndex = (redemptionCurrentPage - 1) * redemptionItemsPerPage
  const redemptionEndIndex = redemptionStartIndex + redemptionItemsPerPage
  const currentRedemptions = filteredRedemptions.slice(redemptionStartIndex, redemptionEndIndex)

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

  const handleCreateProduct = () => {
    setProductDialogMode("create")
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setProductDialogMode("edit")
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setProductDialogMode("view")
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleDeleteProductClick = (product: Product) => {
    setDeleteProduct(product)
  }
  const handleDeleteProductConfirm = async () => {
    if (!deleteProduct) return

    try {
      setProducts(products.filter((p) => p.productId !== deleteProduct.productId))
      showSuccess("success", "Product deleted successfully!")
      setDeleteProduct(null)
    } catch (error) {
      showError("error", "Failed to delete product. Please try again.")
    }
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    const newProduct: ProductRequest = {
      shopId: productData.shopId!,
      name: productData.name!,
      description: productData.description!,
      imageUrl: productData.imageUrl!,
      pricePoints: productData.pricePoints!,
      stock: productData.stock!,
      isActive: productData.isActive ?? true,
    }
    try {
      if (productDialogMode === "create") {
        const res = await createProduct(newProduct);
        if (res.success) {
          setProducts([...products, res.data])
          showSuccess("success", "Product created successfully!")
        }
      } else if (productDialogMode === "edit" && selectedProduct) {
        const res = await editProduct(selectedProduct.productId, newProduct);
        if (res.success) {
          setProducts(products.map((p) => (p.productId === selectedProduct.productId ? { ...p, ...res.data } : p)))
          showSuccess("success", "Product updated successfully!")
        }
        
      }
      setIsProductDialogOpen(false)
    } catch (error) {
      showError("error", "Failed to save product. Please try again.")
    }
  }

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

  const getShopName = (shopId: number) => {
    return shops.find((s) => s.shopId === shopId)?.shopName || "Unknown Shop"
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

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
    </div>
  )

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              User Details
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "performance"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Performance
            </button>
            <button
              onClick={() => setActiveTab("shops")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap${
                activeTab === "shops"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Store className="w-4 h-4 inline mr-2" />
              Shop Management
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap${
                activeTab === "products"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Product Management
            </button>
            <button
              onClick={() => setActiveTab("redemptions")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap${
                activeTab === "redemptions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Redemption Management
            </button>
          </nav>
        </div>

        {activeTab === "overview" && <OverviewScreen/>}

        {activeTab === "users" && <UserDetailScreen/>}

        {activeTab === "performance" && <PerformanceScreen/>}

        {activeTab === "shops" && /*(
          <div className="space-y-6">
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
        )} */
        <ShopScreen/>}

        {activeTab === "products" && /*(
          <div className="space-y-6">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search products by name or description..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterShopId}
                    onChange={(e) => setFilterShopId(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value={0}>All Shops</option>
                    {shops.map((shop) => (
                      <option key={shop.shopId} value={shop.shopId}>
                        {shop.shopName}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleCreateProduct} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
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
                        Shop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price Pointsp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
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
                    {currentProducts.length === 0 ? (
                      <tr key="no-product">
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No products found. Create your first product to get started.
                        </td>
                      </tr>
                    ) : (
                      currentProducts.map((product) => (
                        <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <Store className="w-4 h-4 mr-2 text-gray-400" />
                              {getShopName(product.shopId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-blue-600">{product.pricePoints} pts</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-sm ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {product.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.isActive ? (
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
                                onClick={() => handleViewProduct(product)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProductClick(product)}
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

              {filteredProducts.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                      Showing {productStartIndex + 1} to {Math.min(productEndIndex, filteredProducts.length)} of{" "}
                      {filteredProducts.length} products
                    </span>
                    <select
                      value={productItemsPerPage}
                      onChange={(e) => {
                        setProductItemsPerPage(Number(e.target.value))
                        setProductCurrentPage(1)
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
                      onClick={() => setProductCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={productCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: productTotalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={productCurrentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProductCurrentPage(page)}
                        className={productCurrentPage === page ? "bg-blue-600" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProductCurrentPage((p) => Math.min(productTotalPages, p + 1))}
                      disabled={productCurrentPage === productTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )} */
        <ProductScreen/>
        }
        {activeTab === "redemptions" && /*(
          <div className="space-y-6">
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
        )} */
        <RedemptionScreen/>
        }
      </main>

      {/* <ShopDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveShop}
        shop={selectedShop}
        mode={dialogMode}
      />

      <ProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={productDialogMode}
        shops={shops}
      /> */}

      {/* <RedemptionStatusDialog
        isOpen={isRedemptionDialogOpen}
        onClose={() => setIsRedemptionDialogOpen(false)}
        onUpdateStatus={handleUpdateRedemptionStatus}
        redemption={selectedRedemption}
      /> */}

      {/* <ConfirmationDialog
        open={!!deleteShop}
        onOpenChange={() => setDeleteShop(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Shop"
        description={`Are you sure you want to delete "${deleteShop?.shopName}"? This action cannot be undone.`}
        variant="warning"
      />

      <ConfirmationDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
        onConfirm={handleDeleteProductConfirm}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
        variant="warning"
      /> */}
    </div>
  )
}
