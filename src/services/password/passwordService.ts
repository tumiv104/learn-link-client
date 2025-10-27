import api from "@/lib/api"

export async function requestPasswordReset(email: string) {
  const res = await api.post("/password/forgot", { email })
  return res.data
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await api.post("/password/reset", {
    token,
    newPassword,
  })
  return res.data
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const res = await api.post("/password/change", {
    oldPassword,
    newPassword,
  })
  return res.data
}