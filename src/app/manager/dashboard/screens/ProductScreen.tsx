import { ProductDialog } from "@/components/dashboard/manager/ProductDialog";
import { AlertPopup } from "@/components/ui/alert-popup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Product, ProductRequest } from "@/data/shop";
import { useAlert } from "@/hooks/useAlert";
import { createProduct, editProduct, getAllProduct, getAllShop } from "@/services/shop/shopService";
import { CheckCircle, Edit, Eye, Plus, Search, Store, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Shop {
  shopId: number
  shopName: string
  contactInfo: string
  website: string
  isActive: boolean
}

export default function ProductScreen() {
    const [shops, setShops] = useState<Shop[]>([])
  const { alert, showSuccess, showError, hideAlert } = useAlert()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productDialogMode, setProductDialogMode] = useState<"create" | "edit" | "view">("create")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [filterShopId, setFilterShopId] = useState<number>(0)

  const [productCurrentPage, setProductCurrentPage] = useState(1)
  const [productItemsPerPage, setProductItemsPerPage] = useState(10)

    const fetchShop = async () => {
        try {
            const res = await getAllShop();
            setShops(res.data)
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

  useEffect(() => {
    fetchShop();
    fetchProduct();
  }, [])

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

  const productTotalPages = Math.ceil(filteredProducts.length / productItemsPerPage)
  const productStartIndex = (productCurrentPage - 1) * productItemsPerPage
  const productEndIndex = productStartIndex + productItemsPerPage
  const currentProducts = filteredProducts.slice(productStartIndex, productEndIndex)

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

  const getShopName = (shopId: number) => {
    return shops.find((s) => s.shopId === shopId)?.shopName || "Unknown Shop"
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
            <ProductDialog
            isOpen={isProductDialogOpen}
            onClose={() => setIsProductDialogOpen(false)}
            onSave={handleSaveProduct}
            product={selectedProduct}
            mode={productDialogMode}
            shops={shops}
            />
            <ConfirmationDialog
            open={!!deleteProduct}
            onOpenChange={() => setDeleteProduct(null)}
            onConfirm={handleDeleteProductConfirm}
            title="Delete Product"
            description={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
            variant="warning"
            />
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
    );
}
