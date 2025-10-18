import api from "@/lib/api";

export async function getOverview() {
    const res = await api.get("/manager/overview");
    return res.data;
}

export async function getUsersOverview() {
    const res = await api.get("/manager/users");
    return res.data;
}

export async function getParentOverview() {
    const res = await api.get("/manager/parents/performance");
    return res.data;
}

export async function getChildOverview() {
    const res = await api.get("/manager/children/performance");
    return res.data;
}

export async function getCompletionTrend() {
    const res = await api.get("/manager/completion-trend");
    return res.data;
}

export async function getWeeklyActivity() {
    const res = await api.get("/manager/weekly-activity");
    return res.data;
}