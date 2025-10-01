import api from "@/lib/api";

export async function assignMission(fd: FormData) {
  const res = await api.post("/mission/assign", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}