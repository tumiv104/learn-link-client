import api from "@/lib/api"
import type { SubmissionDetailDTO } from "@/data/submissionDetail"
import type { PageResult } from "@/data/pagination"

export async function getParentSubmissions(parentId: number, page = 1, pageSize = 5): Promise<PageResult<SubmissionDetailDTO>> {
  const res = await api.get(`/Submission/parents/${parentId}`, {
    params: { page, pageSize }
  })
  return res.data.data as PageResult<SubmissionDetailDTO>
}

export async function acceptMission(missionId: number) {
  const res = await api.post("/submission/accept", {missionId});
  return res.data;
}

export async function submitMission(missionId: number, fd: FormData) {
  const res = await api.post(`/submission/missions/${missionId}/submit`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function approveSubmission(parentId: number, submissionId: number, score: number, feedback: string) {
  const res = await api.post(`/submission/${parentId}/approve`, {
    submissionId,
    score,
    feedback
  })
  return res.data
}

export async function rejectSubmission(parentId: number, submissionId: number, score: number, feedback: string) {
  const res = await api.post(`/submission/${parentId}/reject`, {
    submissionId,
    score,
    feedback
  })
  return res.data
}