import api from "@/lib/api";

export async function getPointDetailByUserId(userId: number) {
    const res = await api.get(`/point/detail/${userId}`);
    return res.data;
}