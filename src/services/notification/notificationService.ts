import api from "@/lib/api";

export async function getNotificationByUserId(userId: number) {
    const res = await api.get(`/notification/getAll/${userId}`);
    return res.data;
}

export async function markAsRead(id: number) {
    const res = await api.put(`/notification/markRead/${id}`);
    return res.data;
}

export async function markAllAsRead(userId: number) {
    const res = await api.put(`/notification/markAllRead/${userId}`);
    return res.data;
}