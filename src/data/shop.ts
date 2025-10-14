export interface Product {
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

export interface ProductResponse {
  productId: number
  shopId: number
  shopName: string
  name: string
  description: string
  imageUrl: string
  pricePoints: number
  stock: number
  isActive: boolean
  createdAt: string
}

export interface ShopRequest {
  shopName: string,
  contactInfo?: string,
  website?: string,
  isActive: boolean
}

export interface ProductRequest {
  shopId: number
  name: string
  description: string
  imageUrl: string
  pricePoints: number
  stock: number
  isActive: boolean
}

export interface RedemptionResponse {
  redemptionId: number
  productId: number
  productName: string
  productImage: string
  shopName: string
  pointsSpent: number
  childId: number
  childName: string
  status: string
  createdAt: string
}