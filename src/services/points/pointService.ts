import api from "@/lib/api";

export async function getPointDetailByUserId(userId: number) {
    const res = await api.get(`/point/detail/${userId}`);
    return res.data;
}

export async function redeemProduct(childId: number, productId: number) {
    const payload = {childId, productId}
    const res = await api.post("/point/redeem/product", payload);
    return res.data; 
}

export async function getAllChildRedemption() {
    const res = await api.get(`/point/redemption/child`);
    return res.data;
}

export async function getAllRedemption() {
    const res = await api.get(`/point/redemption/getAll`);
    return res.data;
}

export async function updateStatus(redemptionId: number, newStatus: string) {
    const payload = {redemptionId, newStatus}
    const res = await api.post("/point/redemption/updateStatus", payload);
    return res.data; 
}