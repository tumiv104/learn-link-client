import { ProductRequest, ShopRequest } from "@/data/shop";
import api from "@/lib/api";

export async function getAllShop() {
    const res = await api.get("/shop/getAll");
    return res.data;
}

export async function createShop(shop: ShopRequest) {
    const res = await api.post("/shop/create", shop);
    return res.data;
}

export async function editShop(shopId: number, shop: ShopRequest) {
    const res = await api.put(`/shop/edit/${shopId}`, shop);
    return res.data;
}

export async function getAllProduct() {
    const res = await api.get("/product/getAll");
    return res.data;
}

export async function createProduct(product: ProductRequest) {
    const res = await api.post("/product/create", product);
    return res.data;
}

export async function editProduct(productId: number, product: ProductRequest) {
    const res = await api.put(`/product/edit/${productId}`, product);
    return res.data;
}