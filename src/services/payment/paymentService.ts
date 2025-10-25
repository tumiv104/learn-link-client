import api from "@/lib/api";

export async function createMomoPayment(parentId: number, amount: number) {
    const payload = { parentId, amount};
    const res = await api.post("/payment/momo-create", payload);
    return res.data;
}

export async function createPayOSPayment(parentId: number, amount: number) {
    const payload = { parentId, amount};
    const res = await api.post("/payment/payos-create", payload);
    return res.data;
}

export async function createPremiumPayment(parentId: number) {
  const payload = { parentId, amount: 99000 }
  const res = await api.post("/payment/premium-upgrade", payload)
  return res.data
}

export async function updatePaymentStatus(paymentId: number, status: string) {
    const payload = { paymentId, status};
    const res = await api.post("/payment/update-status", payload);
    return res.data;
}